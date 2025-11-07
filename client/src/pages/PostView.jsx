// PostView.jsx - Single post view with comments

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/api';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import './PostView.css';

// Helper function to format time ago
const formatTimeAgo = (date) => {
  const now = new Date();
  const postDate = new Date(date);
  const seconds = Math.floor((now - postDate) / 1000);
  
  if (seconds < 60) return 'Just now';
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
  
  const years = Math.floor(days / 365);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const availableEmojis = ['👍', '❤️', '😂', '😮', '😢', '🎉'];

  const { data: postData, loading, execute: fetchPost } = useApi(
    () => postService.getPost(id),
    false
  );

  React.useEffect(() => {
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.deletePost(id);
        navigate('/');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete post');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await postService.addComment(id, { content: comment });
      setComment('');
      fetchPost();
    } catch (error) {
      console.error('Comment error:', error);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (commentId, emoji) => {
    if (!isAuthenticated) {
      alert('Please login to react to comments');
      return;
    }

    try {
      await postService.addReaction(id, commentId, emoji);
      fetchPost();
    } catch (error) {
      console.error('Reaction error:', error);
      alert('Failed to add reaction');
    }
  };

  const getReactionCount = (reactions, emoji) => {
    return reactions?.filter((r) => r.emoji === emoji).length || 0;
  };

  const hasUserReacted = (reactions, emoji) => {
    return reactions?.some((r) => r.user._id === user?.id && r.emoji === emoji);
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  const post = postData?.data;

  if (!post) {
    return <div className="error">Post not found</div>;
  }

  const canEdit = isAuthenticated && (user?.id === post.author?._id || user?.role === 'admin');

  return (
    <div className="post-view">
      <article className="post-article">
        {post.featuredImage && (
          <div className="post-featured-image">
            <img
              src={
                post.featuredImage.startsWith('http')
                  ? post.featuredImage
                  : `http://localhost:5000/uploads/${post.featuredImage}`
              }
              alt={post.title}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80';
              }}
            />
          </div>
        )}

        <div className="post-header">
          <div className="post-meta">
            <Link to={`/?category=${post.category?.slug}`} className="post-category">
              {post.category?.name}
            </Link>
            <div className="post-datetime">
              <span className="post-date">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
              <span className="post-time">
                {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <span className="post-views">{post.viewCount} views</span>
          </div>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-author-info">
            By {post.author?.username}
          </div>
        </div>

        <div className="post-content">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {canEdit && (
          <div className="post-actions">
            <Link to={`/posts/${id}/edit`} className="edit-button">
              Edit
            </Link>
            <button onClick={handleDelete} className="delete-button">
              Delete
            </button>
          </div>
        )}
      </article>

      <section className="comments-section">
        <h2>Comments ({post.comments?.length || 0})</h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows="4"
              className="comment-input"
            />
            <button type="submit" disabled={submitting} className="comment-submit">
              {submitting ? 'Submitting...' : 'Add Comment'}
            </button>
          </form>
        ) : (
          <div className="comment-login-prompt">
            <Link to="/login">Login</Link> to add a comment
          </div>
        )}

        <div className="comments-list">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div key={comment._id} className="comment">
                <div className="comment-header">
                  <strong>{comment.user?.username || 'Anonymous'}</strong>
                  <div className="comment-datetime">
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="comment-content">{comment.content}</div>
                <div className="comment-reactions">
                  {availableEmojis.map((emoji) => {
                    const count = getReactionCount(comment.reactions, emoji);
                    const userReacted = hasUserReacted(comment.reactions, emoji);
                    return (
                      <button
                        key={emoji}
                        onClick={() => handleReaction(comment._id, emoji)}
                        className={`reaction-button ${userReacted ? 'active' : ''} ${!isAuthenticated ? 'disabled' : ''}`}
                        disabled={!isAuthenticated}
                        title={isAuthenticated ? 'React' : 'Login to react'}
                      >
                        <span className="emoji">{emoji}</span>
                        {count > 0 && <span className="count">{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="no-comments">No comments yet. Be the first to comment!</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PostView;

