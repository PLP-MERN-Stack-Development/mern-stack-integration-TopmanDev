// postController.js - Post controller for handling post-related requests

const Post = require('../models/Post');
const Category = require('../models/Category');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.q;

    // Build query
    let query = {};
    
    // Filter by category if provided
    if (category) {
      const categoryDoc = await Category.findOne({ slug: category });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
      ];
    }

    // Get posts
    const posts = await Post.find(query)
      .populate('category', 'name slug')
      .populate('author', 'username')
      .populate('comments.user', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
    })
      .populate('category', 'name slug')
      .populate('author', 'username')
      .populate('comments.user', 'username');

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Increment view count
    await post.incrementViewCount();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
  try {
    // Basic validation
    if (!req.body.title || !req.body.content || !req.body.category) {
      return res.status(400).json({
        success: false,
        error: 'Title, content, and category are required',
      });
    }

    // Add user to req.body
    req.body.author = req.user.id;

    // Handle featured image
    if (req.file) {
      req.body.featuredImage = req.file.filename;
    }

    // Handle tags from FormData (can be JSON string or array)
    if (req.body.tags) {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (e) {
        // If not JSON, treat as comma-separated string
        if (typeof req.body.tags === 'string') {
          req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        }
      }
    } else {
      req.body.tags = [];
    }

    // Convert isPublished to boolean if it's a string
    if (typeof req.body.isPublished === 'string') {
      req.body.isPublished = req.body.isPublished === 'true';
    }

    const post = await Post.create(req.body);

    const populatedPost = await Post.findById(post._id)
      .populate('category', 'name slug')
      .populate('author', 'username');

    res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (error) {
    // Check for duplicate key error (user trying to create post with same title)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'You already have a post with this title. Please use a different title.',
      });
    }
    next(error);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Make sure user is post owner
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this post',
      });
    }

    // Handle featured image
    if (req.file) {
      req.body.featuredImage = req.file.filename;
    }

    // Handle tags from FormData
    if (req.body.tags) {
      try {
        req.body.tags = JSON.parse(req.body.tags);
      } catch (e) {
        if (typeof req.body.tags === 'string') {
          req.body.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        }
      }
    }

    // Convert isPublished to boolean if it's a string
    if (typeof req.body.isPublished === 'string') {
      req.body.isPublished = req.body.isPublished === 'true';
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name slug')
      .populate('author', 'username');

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    // Check for duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'You already have a post with this title. Please use a different title.',
      });
    }
    next(error);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this post',
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    await post.addComment(req.user.id, req.body.content);

    const updatedPost = await Post.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('author', 'username')
      .populate('comments.user', 'username');

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search posts
// @route   GET /api/posts/search
// @access  Public
exports.searchPosts = async (req, res, next) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a search query',
      });
    }

    const posts = await Post.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { excerpt: { $regex: query, $options: 'i' } },
      ],
    })
      .populate('category', 'name slug')
      .populate('author', 'username')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add reaction to comment
// @route   POST /api/posts/:id/comments/:commentId/reactions
// @access  Private
exports.addReaction = async (req, res, next) => {
  try {
    const { id, commentId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an emoji',
      });
    }

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    await post.addReaction(commentId, req.user.id, emoji);

    const updatedPost = await Post.findById(id)
      .populate('category', 'name slug')
      .populate('author', 'username')
      .populate('comments.user', 'username')
      .populate('comments.reactions.user', 'username');

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    if (error.message === 'Comment not found') {
      return res.status(404).json({
        success: false,
        error: 'Comment not found',
      });
    }
    next(error);
  }
};


