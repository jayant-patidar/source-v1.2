# How to Run the Application

This guide provides instructions on how to set up and run the full-stack application (Backend Server + Frontend Client).

## Prerequisites
- **Node.js** (v14 or higher recommended)
- **npm** (Node Package Manager)
- **MongoDB** (Local instance running on default port `27017` or a cloud Atlas URI)

## 1. Backend Server Setup

The server is built with Node.js, Express, and TypeScript.

1.  **Navigate to the server directory:**
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Ensure you have a `.env` file in the `server` root directory with the following variables (example):
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/your_database_name
    JWT_SECRET=your_jwt_secret
    JWT_REFRESH_SECRET=your_refresh_secret
    NODE_ENV=development
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```
    The server should start running on `http://localhost:5000`.

## 2. Frontend Client Setup

The client is built with React, Vite, and TypeScript.

1.  **Navigate to the client directory:**
    Open a new terminal window and navigate to the client folder:
    ```bash
    cd client
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the client:**
    ```bash
    npm run dev
    ```
    The client should start running on `http://localhost:5173` (or similar port provided by Vite).

## 3. Accessing the Application

- Open your browser and go to the URL provided by the client (e.g., `http://localhost:5173`).
- Ensure the backend server is running for API requests to work.
