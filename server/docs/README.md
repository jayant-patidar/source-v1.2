# Backend Documentation

Welcome to the backend documentation for the Job Marketplace application.

## Documentation Files

### 📁 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
Complete overview of the backend project structure, directory organization, and architectural principles.

**Topics covered:**
- Directory structure and file organization
- Component-based architecture explanation
- Layered architecture (Controller-Service-DAL)
- File naming conventions
- Import patterns
- Environment variables
- How to add new components

### 🎯 [FEATURES.md](./FEATURES.md)
Comprehensive documentation of all backend features and API endpoints.

**Topics covered:**
- User Management (registration, authentication, profiles)
- Job Management (posting, searching, status tracking)
- Negotiation System (offers, acceptance, rejection)
- Review System (ratings, comments, replies)
- Notification System (real-time alerts, read states)
- Transaction System (payment tracking, statuses)
- API endpoint specifications
- Request/response examples
- Business rules and validation

### 💻 [CODE_STRUCTURE.md](./CODE_STRUCTURE.md)
Detailed guide on code structure and patterns for each file type.

**Topics covered:**
- Model files (schema definitions)
- DAL files (database operations)
- Service files (business logic)
- Controller files (HTTP handling)
- Route files (endpoint mapping)
- Code examples for each layer
- Common patterns and best practices
- Data flow diagrams

## Quick Start

1. **Understanding the Architecture**: Start with [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
2. **Learning the Features**: Read [FEATURES.md](./FEATURES.md)
3. **Writing Code**: Reference [CODE_STRUCTURE.md](./CODE_STRUCTURE.md)

## Architecture Overview

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP Request
       ▼
┌─────────────┐
│   Routes    │ ← Define endpoints
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Controller  │ ← Handle HTTP
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Service    │ ← Business Logic
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     DAL     │ ← Database Queries
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  MongoDB    │
└─────────────┘
```

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, CORS
- **Logging**: Winston

## Project Structure

```
server/
├── docs/                    # This documentation
├── src/
│   ├── components/          # Feature modules
│   │   ├── user/
│   │   ├── job/
│   │   ├── negotiation/
│   │   ├── review/
│   │   ├── notification/
│   │   └── transaction/
│   ├── config/              # Configuration
│   ├── middleware/          # Express middleware
│   └── utils/               # Utilities
├── .env                     # Environment variables
└── package.json
```

## Contributing

When adding new features:

1. Follow the component-based structure
2. Implement all 5 files (model, dal, service, controller, routes)
3. Update this documentation
4. Add tests (when test suite is implemented)

## Support

For questions or issues, refer to:
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for architecture questions
- [FEATURES.md](./FEATURES.md) for API usage
- [CODE_STRUCTURE.md](./CODE_STRUCTURE.md) for implementation patterns
