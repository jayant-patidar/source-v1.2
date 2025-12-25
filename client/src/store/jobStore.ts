import { create } from 'zustand';
import { jobService } from '../services/job.service';

interface Job {
  _id: string;
  title: string;
  description: string;
  originalPay: number;
  type: string;
  location: {
    general: string;
    exact: string;
  };
  jobDate: string;
  jobTime: string;
  category: string;
  createdAt: string;

  seekerId: {
    _id: string;
    name: string;
    seekerRating: number;
    providerRating: number;
    avatar?: string;
  };
}

interface JobState {
  jobs: Job[];
  recentJobs: Job[];
  recommendedJobs: Job[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: (filters?: any) => Promise<void>;
  fetchRecentJobs: () => Promise<void>;
  fetchRecommendedJobs: () => Promise<void>;
  createJob: (jobData: any) => Promise<void>;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  recentJobs: [],
  recommendedJobs: [],
  isLoading: false,
  error: null,
  
  fetchJobs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await jobService.getJobs(filters);
      set({ jobs: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, jobs: [] });
    }
  },

  fetchRecentJobs: async () => {
    try {
      const data = await jobService.getRecentJobs();
      set({ recentJobs: Array.isArray(data) ? data : [] });
    } catch (error: any) {
      console.error('Failed to fetch recent jobs:', error);
    }
  },

  fetchRecommendedJobs: async () => {
    try {
      const data = await jobService.getRecommendedJobs();
      set({ recommendedJobs: Array.isArray(data) ? data : [] });
    } catch (error: any) {
      console.error('Failed to fetch recommended jobs:', error);
    }
  },

  createJob: async (jobData) => {
    set({ isLoading: true, error: null });
    try {
      await jobService.createJob(jobData);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
