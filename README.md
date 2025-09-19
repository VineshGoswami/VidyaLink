# VidyaLink

VidyaLink is an educational platform that connects students and teachers for interactive learning experiences.

## Project Structure

The project consists of two main parts:

- **Frontend**: React application built with Vite
- **Backend**: Node.js/Express API server

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
npm run install:all
```

This will install dependencies for the root project, frontend, and backend.

### Environment Variables

- Frontend (.env): Contains API URL configuration
- Backend (.env): Contains secrets and configuration settings

### Running the Application

To start both frontend and backend concurrently:

```bash
npm start
```

Or run them separately:

- Frontend: `npm run start:frontend`
- Backend: `npm run start:backend`

### Testing API Connectivity

To test the connection between frontend and backend:

```bash
npm run test:api
```

## Access the Application

- Frontend: http://localhost:4028
- Backend API: http://localhost:8000/api/v1 (or alternative ports 8001-8005 if 8000 is in use)

## Port Handling

The application includes dynamic port handling:

- Backend will automatically try ports 8000-8005 if the default port is in use
- Frontend will automatically discover which port the backend is running on
- No manual configuration needed when ports are already in use

## Features

- User authentication
- Video recordings
- Quizzes
- Chatbot integration
- Analytics
- Leaderboard
- Q&A functionality
- Attendance tracking