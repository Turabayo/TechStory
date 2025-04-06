// hertechstory-backend/routes/commentRoutes.js
const express = require('express');
const {
  addComment,
  getComments,
  getAllComments,
  deleteComment, // ✅ Added
} = require('../controllers/commentController');

const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware'); // ✅ Fixed reference

const router = express.Router();

// ✅ Admin-only route: Fetch all comments
router.get('/', authMiddleware, adminMiddleware, getAllComments);

// ✅ Authenticated users can post comments
router.post('/:storyId', authMiddleware, addComment);

// ✅ Public route to get comments for a specific story
router.get('/:storyId', getComments);

// ✅ Admin-only: Delete comment
router.delete('/:id', authMiddleware, adminMiddleware, deleteComment); // ✅ Now correctly added

module.exports = router;
