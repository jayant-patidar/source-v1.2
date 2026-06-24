# Source (Client Frontend)

This is the frontend client application for the Job Marketplace, built with React, TypeScript, and Vite.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Material UI (MUI) v5
- **State Management**: Zustand
- **Routing**: React Router DOM v6
- **Forms & Validation**: Formik + Yup
- **API Client**: Axios
- **Date/Time Formatting**: date-fns

## Directory Structure

```
client/
├── public/                 # Static assets (images, icons)
├── src/
│   ├── assets/             # Bundled static assets
│   ├── components/         # Reusable UI components
│   │   ├── JobCard.tsx
│   │   ├── NotificationMenu.tsx
│   │   └── ...
│   ├── pages/              # Route level components/views
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Profile.tsx
│   │   └── ...
│   ├── store/              # Zustand global state stores
│   │   ├── authStore.ts
│   │   ├── jobStore.ts
│   │   └── toastStore.ts
│   ├── services/           # Axios instance and API logic
│   │   └── api.ts
│   ├── App.tsx             # Main Application / Routing Setup
│   └── main.tsx            # Entry point
├── package.json
└── vite.config.ts
```

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `npm run build`

Builds the app for production to the `dist` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Runs ESLint to check for code quality and standard adherence.

## Environment Variables

Ensure you have your environment variables set up, particularly pointing to the backend API.
By default in development, it may proxy requests or point directly to the backend URL via Axios base config.
