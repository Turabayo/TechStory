// hertechstory-backend/routes/analyticsRoutes.js
const express = require('express');
const { trackView, trackShare, getAnalytics } = require('../controllers/analyticsController');
const router = express.Router();

router.post('/view/:storyId', trackView);
router.post('/share/:storyId', trackShare);
router.get('/stats', getAnalytics);

module.exports = router;
