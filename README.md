# HerTechStory Frontend

This is the frontend of HerTechStory, built using **Next.js**, **TypeScript**, **Material UI**, and **TailwindCSS**.

## 🌐 Tech Stack
- Next.js (App Router)
- TypeScript
- TailwindCSS + Material UI
- React Hook Form
- Axios

## ✨ Features
- User onboarding
- Text, voice, and video story submission
- AI transcription preview
- Admin dashboard (approve/reject/delete)
- Public story browsing
- Export metrics and CSV

## 🚀 Setup Instructions

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Create environment file
Create `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### 3. Run the frontend
```bash
npm run dev
```

Runs at: `http://localhost:3000`

## 📁 Key Structure
- `app/` - App router pages
- `components/` - Reusable UI elements
- `hooks/` - Auth and helpers
- `middleware/` - Route protection
- `theme.ts` - MUI customization



# HerTechStory Backend

This is the backend for the HerTechStory platform, responsible for authentication, story handling, file uploads, AI transcription, user management, and more.

## 📦 Tech Stack
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer
- JWT Authentication
- Google Cloud Speech-to-Text or Whisper AI
- CORS

## 🚀 Setup Instructions

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Setup environment variables
Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_APPLICATION_CREDENTIALS=./config/gcp-key.json
```

> 📝 Ensure `gcp-key.json` exists if using Google Cloud transcription.

### 3. Run the server
```bash
npm run dev
```

Server will run at: `http://localhost:5000`

## 📁 Key Folders

- `routes/` - API route definitions
- `controllers/` - Business logic
- `models/` - Mongoose schemas
- `middlewares/` - JWT, Multer, role protection
- `config/` - GCP or Whisper config
- `uploads/` - For audio/video

## 🧠 AI Integration

- Speech-to-Text: Google Cloud or Whisper
- Text-to-Speech: Google or custom utils

















