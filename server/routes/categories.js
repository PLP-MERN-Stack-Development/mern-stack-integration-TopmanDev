// categories.js - Category routes

const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');
const { validate, categorySchemas } = require('../middleware/validation');

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (Admin only)
router.post('/', protect, authorize('admin'), validate(categorySchemas.create), createCategory);
router.put('/:id', protect, authorize('admin'), validate(categorySchemas.update), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;

