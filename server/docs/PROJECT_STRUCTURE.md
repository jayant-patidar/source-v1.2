# Backend Project Structure

## Overview
This backend follows a **component-based architecture** using the **Controller-Service-DAL** pattern. Each feature is self-contained within its own component directory.

## Directory Structure

```
server/
├── src/
│   ├── app.ts                      # Main application entry point
│   ├── components/                 # Feature components (modular architecture)
│   │   ├── user/                   # User management & authentication
│   │   │   ├── user.model.ts       # Mongoose schema & TypeScript interface
│   │   │   ├── user.dal.ts         # Data Access Layer (DB operations)
│   │   │   ├── user.service.ts     # Business logic
│   │   │   ├── user.controller.ts  # Request/response handlers
│   │   │   └── user.routes.ts      # API route definitions
│   │   ├── job/                    # Job posting & management
│   │   │   ├── job.model.ts
│   │   │   ├── job.dal.ts
│   │   │   ├── job.service.ts
│   │   │   ├── job.controller.ts
│   │   │   └── job.routes.ts
│   │   ├── negotiation/            # Job offer negotiations
│   │   │   ├── negotiation.model.ts
│   │   │   ├── negotiation.dal.ts
│   │   │   ├── negotiation.service.ts
│   │   │   ├── negotiation.controller.ts
│   │   │   └── negotiation.routes.ts
│   │   └── review/                 # User reviews & ratings
│   │       ├── review.model.ts
│   │       ├── review.dal.ts
│   │       ├── review.service.ts
│   │       ├── review.controller.ts
│   │       └── review.routes.ts
│   ├── config/                     # Configuration files
│   │   └── db.ts                   # MongoDB connection setup
│   ├── middleware/                 # Express middleware
│   │   ├── auth.middleware.ts      # JWT authentication
│   │   └── error.middleware.ts     # Global error handler
│   └── utils/                      # Utility functions
│       ├── logger.ts               # Winston logger configuration
│       └── generateToken.ts        # JWT token generation
├── .env                            # Environment variables
├── package.json                    # Dependencies & scripts
└── tsconfig.json                   # TypeScript configuration

```

## Architecture Principles

### 1. Component-Based Organization
Each feature (User, Job, Negotiation, Review) is organized as a **self-contained component** with all related files in one directory.

**Benefits:**
- Easy to locate all code related to a feature
- Promotes modularity and reusability
- Simplifies testing and maintenance
- Clear separation of concerns

### 2. Layered Architecture (Controller-Service-DAL)

Each component follows a three-layer pattern:

```
Request → Controller → Service → DAL → Database
                ↓         ↓       ↓
            Validation  Logic   Queries
```

**Layer Responsibilities:**
- **Controller**: HTTP request/response handling
- **Service**: Business logic and orchestration
- **DAL**: Database operations only

### 3. Single Responsibility
Each file has one clear purpose:
- **Model**: Schema definition
- **DAL**: Database queries
- **Service**: Business rules
- **Controller**: HTTP handling
- **Routes**: Endpoint mapping

## Key Directories Explained

### `/src/components`
Contains all feature modules. Each component is independent and follows the same structure.

### `/src/config`
Configuration files for external services (database, cache, etc.)

### `/src/middleware`
Reusable Express middleware functions that run before route handlers.

### `/src/utils`
Helper functions and utilities used across the application.

## File Naming Conventions

- **Models**: `{feature}.model.ts` - Singular, lowercase
- **DAL**: `{feature}.dal.ts` - Matches model name
- **Services**: `{feature}.service.ts` - Matches model name
- **Controllers**: `{feature}.controller.ts` - Matches model name
- **Routes**: `{feature}.routes.ts` - Matches model name

## Import Patterns

### Within Component
```typescript
// In user.service.ts
import UserDAL from './user.dal';
import { IUser } from './user.model';
```

### Cross-Component
```typescript
// In negotiation.service.ts
import JobDAL from '../job/job.dal';
import UserDAL from '../user/user.dal';
```

### Shared Resources
```typescript
// Any component
import { protect } from '../../middleware/auth.middleware';
import logger from '../../utils/logger';
```

## Environment Variables

Required variables in `.env`:
```
PORT=5000
DB_USER=your_mongodb_user
DB_PASSWORD=your_mongodb_password
DB_CLUSTER=your_cluster.mongodb.net
DB_TLD=retryWrites=true&w=majority
DB_NAME=job_marketplace
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## Adding a New Component

To add a new feature component:

1. Create directory: `src/components/{feature}/`
2. Create files:
   - `{feature}.model.ts` - Define schema
   - `{feature}.dal.ts` - Database operations
   - `{feature}.service.ts` - Business logic
   - `{feature}.controller.ts` - HTTP handlers
   - `{feature}.routes.ts` - Route definitions
3. Register routes in `src/app.ts`:
   ```typescript
   import featureRoutes from './components/feature/feature.routes';
   app.use('/api/features', featureRoutes);
   ```

## Best Practices

1. **Keep components independent** - Avoid tight coupling
2. **Use DAL for all DB operations** - Never query directly in Service/Controller
3. **Handle errors in Service layer** - Throw meaningful errors
4. **Validate in Controller** - Check request data before passing to Service
5. **Use TypeScript interfaces** - Define types for all data structures
6. **Export singleton instances** - Controllers and Services should be singletons
