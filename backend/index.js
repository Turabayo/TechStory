// hertechstory-backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');

// Routes
const authRoutes = require('./routes/authRoutes');
const storyRoutes = require('./routes/storyRoutes');
const commentRoutes = require('./routes/commentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const seedRoutes = require('./routes/seedRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://hertechstoryempoweringwomenempoweringgenerations-kcy2m8jmc.vercel.app",
  "https://hertechstoryempoweringwomenempoweringgenerations-njuzkzkp5.vercel.app", // newly generated one
];

// You may also allow all *.vercel.app domains using RegExp (optional/flexible)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, curl, etc.
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)       // ✅ Allow all Vercel preview domains
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// ✅ Serve static uploads (audio/video)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dev', seedRoutes); // For seeding stories

// ✅ Root Health Check
app.get('/', (req, res) => {
  res.send('HerTechStory API is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
