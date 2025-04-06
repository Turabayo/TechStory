// hertechstory-backend/controllers/commentController.js
const Comment = require('../models/Comment');

// ✅ Add a comment to a story
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { storyId } = req.params;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const newComment = await Comment.create({
      user: req.user.id,
      story: storyId.trim(),
      text,
    });

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get comments for a specific story
exports.getComments = async (req, res) => {
  try {
    const { storyId } = req.params;

    const comments = await Comment.find({ story: storyId })
      .populate('user', 'name avatar');

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin: Get all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('story', 'title');

    res.status(200).json(comments);
  } catch (error) {
    console.error("❌ Error fetching all comments:", error);
    res.status(500).json({ message: "Failed to fetch comments", error: error.message });
  }
};

// ✅ Admin: Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting comment:", error);
    res.status(500).json({ message: "Failed to delete comment", error: error.message });
  }
};
