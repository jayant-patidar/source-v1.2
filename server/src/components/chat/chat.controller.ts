import { Request, Response } from 'express';
import OpenAI from 'openai';
import Job from '../job/job.model';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key_for_build', // Securely loaded from .env
});

export const searchJobsWithAI = async (req: Request, res: Response) => {
  try {
    const { message, location: userLocation } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Call OpenAI with function calling to extract parameters
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant helping users find jobs or gigs on the Source platform. 
          Extract the search criteria from the user's message.
          If the user mentions "my area" or "near me" and a userLocation is provided (${userLocation || 'Not provided'}), use it.
          Otherwise, extract the specific location mentioned.
          Available categories are generally: Plumbing, Tech, Cleaning, Landscaping, Electrical, Delivery, etc.
          Job types are typically 'hourly' or 'fixed'.`
        },
        { role: 'user', content: message }
      ],
      functions: [
        {
          name: 'search_jobs',
          description: 'Search for jobs based on extracted parameters',
          parameters: {
            type: 'object',
            properties: {
              category: { type: 'string', description: 'The job category, e.g., plumbing, tech, cleaning' },
              location: { type: 'string', description: 'The city, zip code, or area' },
              minPay: { type: 'number', description: 'The minimum pay or budget expected' },
              type: { type: 'string', enum: ['hourly', 'fixed'], description: 'The payment type' },
              tags: { type: 'array', items: { type: 'string' }, description: 'Keywords or tags associated with the job' }
            }
          }
        }
      ],
      function_call: { name: 'search_jobs' }
    });

    const functionCall = response.choices[0].message?.function_call;

    if (!functionCall || !functionCall.arguments) {
      return res.status(400).json({ error: 'Could not extract search parameters.' });
    }

    const searchParams = JSON.parse(functionCall.arguments);
    
    // Construct MongoDB Query based on schemas
    const query: any = {
      status: 'open',
      visibility: true,
      isArchived: false
    };
    
    // Build priority keyword search across multiple fields
    const searchKeywords: string[] = [];
    if (searchParams.category) searchKeywords.push(searchParams.category);
    if (searchParams.tags && searchParams.tags.length > 0) searchKeywords.push(...searchParams.tags);

    if (searchKeywords.length > 0) {
      const regexes = searchKeywords.map((kw: string) => new RegExp(kw, 'i'));
      query.$or = [
        { title: { $in: regexes } },
        { description: { $in: regexes } },
        { category: { $in: regexes } },
        { tags: { $in: regexes } }
      ];
    }
    
    // Then filter by location
    if (searchParams.location) {
      query['location.general'] = { $regex: new RegExp(searchParams.location, 'i') };
    }
    
    if (searchParams.type) {
      query.type = searchParams.type;
    }
    
    if (searchParams.minPay) {
      query.originalPay = { $gte: searchParams.minPay };
    }

    const jobs = await Job.find(query).limit(5).populate('seekerId', 'name avatar');
    
    // Construct a URL for the frontend to link to
    const queryParams = new URLSearchParams();
    if (searchParams.category) queryParams.append('category', searchParams.category);
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.minPay) queryParams.append('minPay', searchParams.minPay.toString());
    
    const searchUrl = `/search?${queryParams.toString()}`;

    res.status(200).json({
      success: true,
      extractedParams: searchParams,
      jobs,
      searchUrl,
      replyMessage: jobs.length > 0 
        ? `I found ${jobs.length} jobs matching your request. Here are the top results:`
        : `I couldn't find any exact matches right now, but you can try adjusting your search!`
    });

  } catch (error: any) {
    console.error('AI Search Error:', error);
    
    // Check if it's an OpenAI API error
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'The AI service is currently unavailable due to quota limits. Please check your OpenAI billing details.' 
      });
    }
    
    res.status(500).json({ error: 'An error occurred while processing the AI search. ' + (error.message || '') });
  }
};
