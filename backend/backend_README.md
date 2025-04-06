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

