// PostForm.jsx - Create/Edit post form

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postService, categoryService } from '../services/api';
import { useApi } from '../hooks/useApi';
import './PostForm.css';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    isPublished: false,
  });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: categoriesData } = useApi(() => categoryService.getAllCategories(), true);
  const { data: postData, loading: postLoading } = useApi(
    () => postService.getPost(id),
    isEdit
  );

  useEffect(() => {
    if (isEdit && postData?.data) {
      const post = postData.data;
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        category: post.category?._id || '',
        tags: post.tags?.join(', ') || '',
        isPublished: post.isPublished || false,
      });
    }
  }, [isEdit, postData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setFeaturedImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('excerpt', formData.excerpt);
      submitData.append('category', formData.category);
      submitData.append('isPublished', formData.isPublished);
      
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean);
        submitData.append('tags', JSON.stringify(tagsArray));
      }

      if (featuredImage) {
        submitData.append('featuredImage', featuredImage);
      }

      let response;
      if (isEdit) {
        response = await postService.updatePost(id, submitData);
      } else {
        response = await postService.createPost(submitData);
      }

      navigate(`/posts/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save post');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEdit && postLoading) {
    return <div className="loading">Loading post...</div>;
  }

  const categories = categoriesData?.data || [];

  return (
    <div className="post-form-container">
      <h1>{isEdit ? 'Edit Post' : 'Create New Post'}</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            maxLength={100}
          />
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            maxLength={200}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows="15"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="featuredImage">Featured Image</label>
          <input
            type="file"
            id="featuredImage"
            name="featuredImage"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
            />
            Publish post
          </label>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting} className="submit-button">
            {submitting ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;

