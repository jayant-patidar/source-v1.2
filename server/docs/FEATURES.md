# Backend Features Documentation

## Overview
The job marketplace backend provides four main features: User Management, Job Posting, Negotiation System, and Review System.

---

## 1. User Management

### Features
- User registration with enhanced profile data
- JWT-based authentication
- User profile management
- Dual rating system (as seeker and provider)

### Database Schema
```typescript
{
  name: String,           // Full name
  email: String,          // Unique email (login credential)
  password: String,       // Hashed password
  DOB: Date,             // Date of birth
  phone: String,         // Contact number
  address: String,       // Physical address
  seekerRating: Number,  // Rating as job poster (0-5)
  providerRating: Number,// Rating as job worker (0-5)
  about: String,         // Optional bio
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

### API Endpoints

#### POST `/api/users/register`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "DOB": "1990-01-01",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Notes:**
- Password is automatically hashed using bcrypt
- JWT token is set as HTTP-only cookie
- Email must be unique

#### POST `/api/users/login`
Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "seekerRating": 4.5,
  "providerRating": 4.8
}
```

#### POST `/api/users/logout`
Clear authentication token.

**Authentication:** Required

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

#### GET `/api/users/profile`
Get current user's profile.

**Authentication:** Required

**Response:**
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "DOB": "1990-01-01",
  "phone": "1234567890",
  "address": "123 Main St",
  "seekerRating": 4.5,
  "providerRating": 4.8,
  "about": "Experienced professional"
}
```

---

## 2. Job Management

### Features
- Create job postings with detailed information
- Search and filter jobs
- Track job status (open, accepted, completed, canceled)
- Location privacy controls
- Pay negotiation support
- Job expiration dates

### Database Schema
```typescript
{
  title: String,              // Job title
  description: String,        // Detailed description
  seekerId: ObjectId,         // User who posted (required)
  providerId: ObjectId,       // User who accepted (optional)
  jobDate: Date,             // When job should be done
  jobTime: String,           // Time (e.g., "10:00 AM")
  originalPay: Number,       // Initial pay amount
  updatedPay: [{             // Pay update history
    pay: Number,
    updatedAt: Date
  }],
  location: {
    general: String,         // Public location (e.g., "New York")
    exact: String            // Private address
  },
  visibility: Boolean,       // Show exact location?
  isNegotiable: Boolean,     // Allow pay negotiation?
  expirationDate: Date,      // When posting expires
  category: String,          // Job category
  status: String,            // open/accepted/completed/canceled
  type: String,              // Optional job type
  tags: [String],            // Optional tags
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### POST `/api/jobs`
Create a new job posting.

**Authentication:** Required

**Request Body:**
```json
{
  "title": "House Cleaning",
  "description": "Need help cleaning 3-bedroom house",
  "generalLocation": "Brooklyn, NY",
  "exactLocation": "123 Oak Street",
  "pay": 100,
  "payType": "fixed",
  "category": "Cleaning",
  "jobDate": "2025-01-15",
  "jobTime": "10:00",
  "expirationDate": "2025-01-10",
  "isNegotiable": true
}
```

**Response:**
```json
{
  "_id": "job_id",
  "title": "House Cleaning",
  "seekerId": "user_id",
  "status": "open",
  ...
}
```

#### GET `/api/jobs`
Get all jobs with optional filters.

**Query Parameters:**
- `keyword` - Search in title
- `category` - Filter by category

**Response:**
```json
[
  {
    "_id": "job_id",
    "title": "House Cleaning",
    "description": "...",
    "seekerId": {
      "name": "John Doe",
      "email": "john@example.com",
      "rating": 4.5
    },
    "location": {
      "general": "Brooklyn, NY",
      "exact": "123 Oak Street"
    },
    ...
  }
]
```

#### GET `/api/jobs/:id`
Get single job details.

**Response:**
```json
{
  "_id": "job_id",
  "title": "House Cleaning",
  "seekerId": { ... },
  "providerId": { ... },
  ...
}
```

#### PUT `/api/jobs/:id`
Update job details.

**Authentication:** Required

#### DELETE `/api/jobs/:id`
Delete a job posting.

**Authentication:** Required

---

## 3. Negotiation System

### Features
- Make counter-offers on jobs
- Accept or reject offers
- Automatic job assignment on acceptance
- Track negotiation history

### Database Schema
```typescript
{
  job: ObjectId,          // Reference to Job
  seeker: ObjectId,       // User making offer (worker)
  provider: ObjectId,     // Job poster
  amount: Number,         // Proposed pay
  message: String,        // Optional message
  status: String,         // pending/accepted/rejected
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### POST `/api/negotiations`
Create a negotiation offer.

**Authentication:** Required

**Request Body:**
```json
{
  "jobId": "job_id",
  "amount": 120,
  "message": "I can do this for $120"
}
```

**Response:**
```json
{
  "_id": "negotiation_id",
  "job": "job_id",
  "seeker": "worker_id",
  "provider": "poster_id",
  "amount": 120,
  "status": "pending"
}
```

**Business Rules:**
- Cannot negotiate on your own job
- Creates pending offer

#### GET `/api/negotiations/:jobId`
Get all negotiations for a job.

**Authentication:** Required

**Response:**
```json
[
  {
    "_id": "negotiation_id",
    "seeker": {
      "name": "Worker Name",
      "rating": 4.8
    },
    "amount": 120,
    "message": "...",
    "status": "pending",
    "createdAt": "2025-01-01T10:00:00Z"
  }
]
```

#### PUT `/api/negotiations/:id`
Accept or reject a negotiation.

**Authentication:** Required (must be job poster)

**Request Body:**
```json
{
  "status": "accepted"  // or "rejected"
}
```

**Response:**
```json
{
  "_id": "negotiation_id",
  "status": "accepted",
  ...
}
```

**Side Effects:**
- If accepted: Job status → "accepted", providerId set to applicant
- If rejected: No job changes

---

## 4. Review System

### Features
- Rate users after job completion
- Separate ratings for seekers and providers
- Prevent duplicate reviews
- Automatic rating calculation

### Database Schema
```typescript
{
  job: ObjectId,          // Reference to Job
  reviewer: ObjectId,     // User giving review
  reviewee: ObjectId,     // User being reviewed
  rating: Number,         // 1-5 stars
  comment: String,        // Review text
  createdAt: Date,
  updatedAt: Date
}
```

### API Endpoints

#### POST `/api/reviews`
Create a review for a user.

**Authentication:** Required

**Request Body:**
```json
{
  "jobId": "job_id",
  "revieweeId": "user_id",
  "rating": 5,
  "comment": "Great work, very professional!"
}
```

**Response:**
```json
{
  "_id": "review_id",
  "job": "job_id",
  "reviewer": "current_user_id",
  "reviewee": "user_id",
  "rating": 5,
  "comment": "Great work, very professional!"
}
```

**Business Rules:**
- Cannot review same user twice for same job
- Automatically updates user's seekerRating or providerRating based on their role in the job

#### GET `/api/reviews/:userId`
Get all reviews for a user.

**Response:**
```json
[
  {
    "_id": "review_id",
    "reviewer": {
      "name": "John Doe"
    },
    "rating": 5,
    "comment": "Great work!",
    "createdAt": "2025-01-01T10:00:00Z"
  }
]
```

---

## Authentication

All protected routes require JWT authentication via HTTP-only cookie.

**Middleware:** `protect` from `auth.middleware.ts`

**Usage in routes:**
```typescript
router.post('/endpoint', protect, controller.method);
```

**How it works:**
1. Client sends request with cookie
2. Middleware extracts and verifies JWT
3. Adds `req.user` with user data
4. Proceeds to route handler or returns 401

---

## Error Handling

All errors are caught and processed by global error handler.

**Error Response Format:**
```json
{
  "message": "Error description",
  "stack": "..." // Only in development
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error
