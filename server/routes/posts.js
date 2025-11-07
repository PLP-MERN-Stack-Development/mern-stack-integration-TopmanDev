// posts.js - Post routes

const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  searchPosts,
  addReaction,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const { validate, postSchemas, commentSchema } = require('../middleware/validation');
const upload = require('../middleware/upload');

// Public routes
router.get('/search', searchPosts);
router.get('/', getPosts);
router.get('/:id', getPost);

// Protected routes (upload middleware must come before validation for FormData)
router.post('/', protect, upload.single('featuredImage'), createPost);
router.put('/:id', protect, upload.single('featuredImage'), updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/comments', protect, validate(commentSchema), addComment);
router.post('/:id/comments/:commentId/reactions', protect, addReaction);

module.exports = router;

