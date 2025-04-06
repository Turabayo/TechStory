// hertechstory-backend/models/Comment.js
const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  story: { type: mongoose.Schema.Types.ObjectId, ref: 'Story', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);