// hertechstory-backend/controllers/analyticsController.js
const Story = require('../models/Story');

exports.trackView = async (req, res) => {
  try {
    const { storyId } = req.params;
    await Story.findByIdAndUpdate(storyId, { $inc: { views: 1 } });
    res.json({ message: 'View recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.trackShare = async (req, res) => {
  try {
    const { storyId } = req.params;
    await Story.findByIdAndUpdate(storyId, { $inc: { shares: 1 } });
    res.json({ message: 'Share recorded' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalStories = await Story.countDocuments();
    const totalViews = await Story.aggregate([{ $group: { _id: null, views: { $sum: '$views' } } }]);
    const totalShares = await Story.aggregate([{ $group: { _id: null, shares: { $sum: '$shares' } } }]);
    res.json({ totalStories, totalViews: totalViews[0]?.views || 0, totalShares: totalShares[0]?.shares || 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
