// validation.js - Input validation middleware using Joi

const Joi = require('joi');

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        errors,
      });
    }
    
    next();
  };
};

// Post validation schemas
const postSchemas = {
  create: Joi.object({
    title: Joi.string().required().trim().max(100).messages({
      'string.empty': 'Title is required',
      'string.max': 'Title cannot be more than 100 characters',
    }),
    content: Joi.string().required().messages({
      'string.empty': 'Content is required',
    }),
    excerpt: Joi.string().max(200).allow('').messages({
      'string.max': 'Excerpt cannot be more than 200 characters',
    }),
    category: Joi.string().required().messages({
      'string.empty': 'Category is required',
    }),
    tags: Joi.array().items(Joi.string()).default([]),
    isPublished: Joi.boolean().default(false),
    featuredImage: Joi.string().allow('').optional(),
  }),

  update: Joi.object({
    title: Joi.string().trim().max(100).optional(),
    content: Joi.string().optional(),
    excerpt: Joi.string().max(200).allow('').optional(),
    category: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    isPublished: Joi.boolean().optional(),
    featuredImage: Joi.string().allow('').optional(),
  }),
};

// Category validation schemas
const categorySchemas = {
  create: Joi.object({
    name: Joi.string().required().trim().max(50).messages({
      'string.empty': 'Category name is required',
      'string.max': 'Category name cannot be more than 50 characters',
    }),
    description: Joi.string().max(200).allow('').messages({
      'string.max': 'Description cannot be more than 200 characters',
    }),
  }),

  update: Joi.object({
    name: Joi.string().trim().max(50).optional(),
    description: Joi.string().max(200).allow('').optional(),
  }),
};

// Auth validation schemas
const authSchemas = {
  register: Joi.object({
    username: Joi.string()
      .required()
      .min(3)
      .max(30)
      .trim()
      .messages({
        'string.empty': 'Username is required',
        'string.min': 'Username must be at least 3 characters',
        'string.max': 'Username cannot be more than 30 characters',
      }),
    email: Joi.string()
      .required()
      .email()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email',
      }),
    password: Joi.string()
      .required()
      .min(6)
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
      }),
  }),

  login: Joi.object({
    email: Joi.string().required().email().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required',
    }),
  }),
};

// Comment validation schema
const commentSchema = Joi.object({
  content: Joi.string().required().trim().messages({
    'string.empty': 'Comment content is required',
  }),
});

module.exports = {
  validate,
  postSchemas,
  categorySchemas,
  authSchemas,
  commentSchema,
};

