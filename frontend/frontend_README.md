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
