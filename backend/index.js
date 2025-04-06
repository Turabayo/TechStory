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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// ✅ Serve static uploads folder (audio/video files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/analytics', analyticsRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('HerTechStory API is running!');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
