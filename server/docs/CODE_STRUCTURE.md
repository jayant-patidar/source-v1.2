# Code Structure Guide

This document explains the structure and patterns for each type of file in our component-based architecture.

---

## 1. Model Files (`*.model.ts`)

### Purpose
Define database schema using Mongoose and TypeScript interfaces.

### Structure
```typescript
import mongoose, { Schema, Document } from 'mongoose';

// 1. TypeScript Interface (exported)
export interface IFeature extends Document {
  field1: string;
  field2: number;
  // ... other fields
}

// 2. Mongoose Schema
const featureSchema = new Schema<IFeature>(
  {
    field1: { type: String, required: true },
    field2: { type: Number, default: 0 },
    // ... other fields
  },
  { timestamps: true } // Auto-adds createdAt/updatedAt
);

// 3. Optional: Instance methods
featureSchema.methods.customMethod = function() {
  // Method implementation
};

// 4. Export model (default export)
export default mongoose.model<IFeature>('Feature', featureSchema);
```

### Example: User Model
```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  DOB: Date;
  phone: string;
  address: string;
  seekerRating: number;
  providerRating: number;
  about?: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    DOB: { type: Date, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    seekerRating: { type: Number, default: 0, min: 0, max: 5 },
    providerRating: { type: Number, default: 0, min: 0, max: 5 },
    about: { type: String, required: false },
  },
  { timestamps: true }
);

// Instance method for password comparison
import bcrypt from 'bcryptjs';
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password as string);
};

export default mongoose.model<IUser>('User', UserSchema);
```

### Key Points
- **Interface first**: Define TypeScript interface extending `Document`
- **Schema second**: Create Mongoose schema with validation
- **Methods**: Add instance/static methods if needed
- **Export both**: Interface (named) and Model (default)

---

## 2. DAL Files (`*.dal.ts`)

### Purpose
Handle ALL database operations. No business logic.

### Structure
```typescript
import Model, { IModel } from './model.model';

class ModelDAL {
  // CREATE operations
  async createModel(data: Partial<IModel>): Promise<IModel> {
    const model = new Model(data);
    return await model.save();
  }

  // READ operations
  async getAllModels(filter: any = {}): Promise<IModel[]> {
    return await Model.find(filter).populate('references');
  }

  async getModelById(id: string): Promise<IModel | null> {
    return await Model.findById(id);
  }

  // UPDATE operations
  async updateModel(id: string, update: Partial<IModel>): Promise<IModel | null> {
    return await Model.findByIdAndUpdate(id, update, { new: true });
  }

  // DELETE operations
  async deleteModel(id: string): Promise<IModel | null> {
    return await Model.findByIdAndDelete(id);
  }

  // CUSTOM queries
  async customQuery(params: any): Promise<IModel[]> {
    return await Model.find({ /* custom query */ });
  }
}

export default ModelDAL;
```

### Example: Job DAL
```typescript
import Job, { IJob } from './job.model';

class JobDAL {
  async createJob(jobData: Partial<IJob>): Promise<IJob> {
    const newJob = new Job(jobData);
    return await newJob.save();
  }

  async getAllJobs(filter: any = {}): Promise<IJob[]> {
    return await Job.find(filter)
      .populate('seekerId', 'name email rating')
      .populate('providerId', 'name email rating')
      .sort({ createdAt: -1 });
  }

  async getJobById(jobId: string): Promise<IJob | null> {
    return await Job.findById(jobId)
      .populate('seekerId', 'name email rating')
      .populate('providerId', 'name email rating');
  }

  async updateJob(jobId: string, updateData: Partial<IJob>): Promise<IJob | null> {
    return await Job.findByIdAndUpdate(jobId, updateData, { new: true });
  }

  async deleteJob(jobId: string): Promise<IJob | null> {
    return await Job.findByIdAndDelete(jobId);
  }
}

export default JobDAL;
```

### Key Points
- **Class-based**: Use class for organization
- **Async/await**: All methods are async
- **Return types**: Always specify return type
- **No logic**: Only database queries, no validation or business rules
- **Populate**: Handle references here

---

## 3. Service Files (`*.service.ts`)

### Purpose
Implement business logic, orchestrate DAL calls, validate data.

### Structure
```typescript
import ModelDAL from './model.dal';
import { IModel } from './model.model';
// Import other DALs if needed
import OtherDAL from '../other/other.dal';

class ModelService {
  private modelDAL: ModelDAL;
  private otherDAL: OtherDAL;

  constructor() {
    this.modelDAL = new ModelDAL();
    this.otherDAL = new OtherDAL();
  }

  async createModel(data: any, userId: string): Promise<IModel> {
    // 1. Validation
    if (!data.requiredField) {
      throw new Error('Required field missing');
    }

    // 2. Business logic
    const processedData = this.processData(data);

    // 3. Check dependencies
    const dependency = await this.otherDAL.getById(data.dependencyId);
    if (!dependency) {
      throw new Error('Dependency not found');
    }

    // 4. Create via DAL
    return await this.modelDAL.createModel({
      ...processedData,
      userId
    });
  }

  async getModels(filters: any): Promise<IModel[]> {
    // Build query filters
    const query = this.buildQuery(filters);
    return await this.modelDAL.getAllModels(query);
  }

  // Private helper methods
  private processData(data: any): any {
    // Data transformation logic
    return data;
  }

  private buildQuery(filters: any): any {
    // Query building logic
    return {};
  }
}

export default ModelService;
```

### Example: Negotiation Service
```typescript
import NegotiationDAL from './negotiation.dal';
import { INegotiation } from './negotiation.model';
import JobDAL from '../job/job.dal';

class NegotiationService {
  private negotiationDAL: NegotiationDAL;
  private jobDAL: JobDAL;

  constructor() {
    this.negotiationDAL = new NegotiationDAL();
    this.jobDAL = new JobDAL();
  }

  async createNegotiation(data: any, userId: string): Promise<INegotiation> {
    // Validate job exists
    const job = await this.jobDAL.getJobById(data.jobId);
    if (!job) {
      throw new Error('Job not found');
    }

    // Business rule: Can't negotiate on own job
    if (job.seekerId.toString() === userId) {
      throw new Error('Cannot negotiate on your own job');
    }

    // Create negotiation
    return await this.negotiationDAL.createNegotiation({
      job: data.jobId,
      seeker: userId,
      provider: job.seekerId,
      amount: data.amount,
      message: data.message
    } as any);
  }

  async updateNegotiationStatus(
    id: string,
    status: 'accepted' | 'rejected',
    userId: string
  ): Promise<INegotiation | null> {
    // Get negotiation
    const negotiation = await this.negotiationDAL.getNegotiationById(id);
    if (!negotiation) {
      throw new Error('Negotiation not found');
    }

    // Authorization check
    if (negotiation.provider.toString() !== userId) {
      throw new Error('Not authorized');
    }

    // Update negotiation
    const updated = await this.negotiationDAL.updateNegotiation(id, { status });

    // Side effect: Update job if accepted
    if (status === 'accepted') {
      await this.jobDAL.updateJob(negotiation.job.toString(), {
        status: 'accepted',
        providerId: negotiation.seeker
      } as any);
    }

    return updated;
  }
}

export default NegotiationService;
```

### Key Points
- **Inject DALs**: Create instances in constructor
- **Throw errors**: Use descriptive error messages
- **Validate first**: Check data before processing
- **Orchestrate**: Coordinate multiple DAL calls
- **Business rules**: Implement all logic here
- **No HTTP**: Don't touch req/res objects

---

## 4. Controller Files (`*.controller.ts`)

### Purpose
Handle HTTP requests/responses, call Service layer.

### Structure
```typescript
import { Request, Response, NextFunction } from 'express';
import ModelService from './model.service';

class ModelController {
  private modelService: ModelService;

  constructor() {
    this.modelService = new ModelService();
  }

  async createModel(req: any, res: Response, next: NextFunction) {
    try {
      // Extract data from request
      const data = req.body;
      const userId = req.user._id;

      // Call service
      const model = await this.modelService.createModel(data, userId);

      // Send response
      res.status(201).json(model);
    } catch (error) {
      next(error); // Pass to error handler
    }
  }

  async getModels(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query;
      const models = await this.modelService.getModels(filters);
      res.json(models);
    } catch (error) {
      next(error);
    }
  }

  async getModelById(req: Request, res: Response, next: NextFunction) {
    try {
      const model = await this.modelService.getModelById(req.params.id);
      if (!model) {
        res.status(404).json({ error: 'Not found' });
        return;
      }
      res.json(model);
    } catch (error) {
      next(error);
    }
  }
}

// Export singleton instance
export default new ModelController();
```

### Example: Job Controller
```typescript
import { Request, Response, NextFunction } from 'express';
import JobService from './job.service';

class JobController {
  private jobService: JobService;

  constructor() {
    this.jobService = new JobService();
  }

  async createJob(req: any, res: Response, next: NextFunction) {
    try {
      const jobData = {
        ...req.body,
        seekerId: req.user._id,
        originalPay: req.body.pay,
        location: {
          general: req.body.generalLocation,
          exact: req.body.exactLocation
        }
      };
      const newJob = await this.jobService.createJob(jobData);
      res.status(201).json(newJob);
    } catch (error) {
      next(error);
    }
  }

  async getAllJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await this.jobService.getAllJobs(req.query);
      res.status(200).json(jobs);
    } catch (error) {
      next(error);
    }
  }

  async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await this.jobService.getJobById(req.params.id);
      if (job) {
        res.status(200).json(job);
      } else {
        res.status(404).json({ error: 'Job not found' });
      }
    } catch (error) {
      next(error);
    }
  }
}

export default new JobController();
```

### Key Points
- **Try-catch**: Wrap all async operations
- **Extract data**: Get from req.body, req.params, req.query
- **Call service**: Pass data to service layer
- **Send response**: Use appropriate status codes
- **Error handling**: Pass errors to next()
- **Singleton**: Export instance, not class

---

## 5. Route Files (`*.routes.ts`)

### Purpose
Define API endpoints and apply middleware.

### Structure
```typescript
import express from 'express';
import modelController from './model.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.get('/', modelController.getModels.bind(modelController));
router.get('/:id', modelController.getModelById.bind(modelController));

// Protected routes
router.post('/', protect, modelController.createModel.bind(modelController));
router.put('/:id', protect, modelController.updateModel.bind(modelController));
router.delete('/:id', protect, modelController.deleteModel.bind(modelController));

export default router;
```

### Example: User Routes
```typescript
import express from 'express';
import userController from './user.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

// Auth Routes (public)
router.post('/register', userController.createUser.bind(userController));
router.post('/login', userController.loginUser.bind(userController));
router.post('/logout', userController.logoutUser.bind(userController));

// Protected Routes
router.get('/profile', protect, userController.getUserProfile.bind(userController));
router.get('/', protect, userController.getAllUsers.bind(userController));
router.get('/:id', protect, userController.getUserById.bind(userController));

export default router;
```

### Key Points
- **Use .bind()**: Preserve controller context
- **Apply middleware**: Use `protect` for auth
- **RESTful**: Follow REST conventions
- **Group logically**: Public vs protected
- **Export router**: Default export

---

## Data Flow Example

Complete flow for creating a job:

```
1. Client → POST /api/jobs
   ↓
2. Express → job.routes.ts
   ↓
3. Middleware → protect (auth check)
   ↓
4. Controller → job.controller.ts
   - Extract req.body
   - Add req.user._id
   ↓
5. Service → job.service.ts
   - Validate data
   - Apply business rules
   ↓
6. DAL → job.dal.ts
   - Create Job document
   - Save to MongoDB
   ↓
7. Response ← Returns through layers
   ↓
8. Client ← JSON response
```

---

## Common Patterns

### Error Handling
```typescript
// In Service
if (!data) {
  throw new Error('Descriptive message');
}

// In Controller
try {
  const result = await this.service.method();
  res.json(result);
} catch (error) {
  next(error); // Global handler catches it
}
```

### Authentication
```typescript
// In Routes
router.post('/', protect, controller.method);

// In Controller
const userId = req.user._id; // Available after protect
```

### Validation
```typescript
// In Service
if (!email || !password) {
  throw new Error('Email and password required');
}
```

### Pagination
```typescript
// In DAL
async getPaginated(page: number, limit: number) {
  return await Model.find()
    .skip((page - 1) * limit)
    .limit(limit);
}
```
