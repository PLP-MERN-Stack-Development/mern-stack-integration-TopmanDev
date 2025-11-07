// Post.js - Mongoose model for blog posts

const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content'],
    },
    featuredImage: {
      type: String,
      default: 'default-post.jpg',
    },
    slug: {
      type: String,
    },
    excerpt: {
      type: String,
      maxlength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    tags: [String],
    isPublished: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
        },
        reactions: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            emoji: {
              type: String,
              required: true,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create compound unique index - user cannot create posts with the same slug
PostSchema.index({ slug: 1, author: 1 }, { unique: true });

// Create slug from title before saving
PostSchema.pre('save', function (next) {
  // Generate slug if it doesn't exist or title is modified
  if (!this.slug || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }
  
  next();
});

// Also handle slug generation for findOneAndUpdate
PostSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  
  if (update.title) {
    update.slug = update.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    this.setUpdate(update);
  }
  
  next();
});

// Virtual for post URL
PostSchema.virtual('url').get(function () {
  return `/posts/${this.slug}`;
});

// Method to add a comment
PostSchema.methods.addComment = function (userId, content) {
  this.comments.push({ user: userId, content, reactions: [] });
  return this.save();
};

// Method to add reaction to a comment
PostSchema.methods.addReaction = function (commentId, userId, emoji) {
  const comment = this.comments.id(commentId);
  if (!comment) {
    throw new Error('Comment not found');
  }
  
  // Check if user already reacted with this emoji
  const existingReaction = comment.reactions.find(
    (r) => r.user.toString() === userId.toString() && r.emoji === emoji
  );
  
  if (existingReaction) {
    // Remove reaction if already exists (toggle)
    comment.reactions = comment.reactions.filter(
      (r) => !(r.user.toString() === userId.toString() && r.emoji === emoji)
    );
  } else {
    // Remove any other reaction from this user and add new one
    comment.reactions = comment.reactions.filter(
      (r) => r.user.toString() !== userId.toString()
    );
    comment.reactions.push({ user: userId, emoji });
  }
  
  return this.save();
};

// Method to increment view count
PostSchema.methods.incrementViewCount = function () {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Post', PostSchema); 