// Home.jsx - Home page with post list, search, and pagination

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { postService, categoryService } from '../services/api';
import { useApi } from '../hooks/useApi';
import { mockPosts, mockCategories } from '../data/mockPosts';
import './Home.css';

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

const Home = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [offlineMode, setOfflineMode] = useState(false);

  const { data: postsData, loading: postsLoading, error: postsError, execute: fetchPosts } = useApi(
    () => postService.getAllPosts(page, limit, selectedCategory),
    false
  );

  const { data: categoriesData, error: categoriesError } = useApi(() => categoryService.getAllCategories(), true);

  React.useEffect(() => {
    // Check if backend is available
    if (postsError || categoriesError) {
      setOfflineMode(true);
    } else {
      setOfflineMode(false);
    }
  }, [postsError, categoriesError]);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      fetchPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory]);

  React.useEffect(() => {
    console.log('Posts Data:', postsData);
    console.log('Posts Error:', postsError);
    console.log('Categories Data:', categoriesData);
    console.log('Categories Error:', categoriesError);
  }, [postsData, postsError, categoriesData, categoriesError]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (offlineMode) {
        // Search in mock data
        const filtered = mockPosts.filter((post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        try {
          const response = await postService.searchPosts(searchQuery);
          setSearchResults(response.data || []);
          setSelectedCategory(''); // Clear category filter when searching
          setPage(1);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      }
      setSelectedCategory('');
      setPage(1);
    } else {
      setSearchResults(null);
      if (!offlineMode) {
        fetchPosts();
      }
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    if (!offlineMode) {
      fetchPosts();
    }
  };

  // Use mock data if offline, otherwise use real data
  const posts = offlineMode
    ? (searchResults !== null ? searchResults : (selectedCategory ? mockPosts.filter(p => p.category.slug === selectedCategory) : mockPosts))
    : (searchResults !== null ? searchResults : (postsData?.data || []));
  
  const categories = offlineMode ? mockCategories : (categoriesData?.data || []);
  const totalPages = offlineMode ? 1 : (searchResults !== null ? 1 : (postsData?.pages || 1));

  console.log('Rendering Home - Posts:', posts, 'Loading:', postsLoading);

  if (postsLoading && page === 1 && !offlineMode) {
    return <div className="loading">Loading posts...</div>;
  }

  return (
    <div className="home">
      {offlineMode && (
        <div className="offline-banner">
          <span className="offline-icon">🔌</span>
          <p>
            <strong>Demo Mode:</strong> Backend is not connected. Showing sample posts. 
           
          
          </p>
        </div>
      )}
      
      <div className="home-header">
        <h1>Blog Posts</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by title, content, or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
          {searchQuery && (
            <button 
              type="button" 
              onClick={handleClearSearch}
              className="clear-button"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </form>
      </div>

      {searchResults !== null && (
        <div className="search-info">
          <p>
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
            {searchResults.length > 0 && ' - Showing all matching posts'}
          </p>
        </div>
      )}

      <div className="filters">
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSearchQuery(''); // Clear search when filtering by category
            setSearchResults(null);
            setPage(1);
          }}
          className="category-filter"
          disabled={searchResults !== null}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
        {selectedCategory && (
          <span className="filter-info">Filtering by: {categories.find(c => c.slug === selectedCategory)?.name}</span>
        )}
      </div>

      <div className="posts-grid">
        {posts.length === 0 ? (
          <div className="no-posts">No posts found.</div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              {post.featuredImage && (
                <div className="post-image">
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
              <div className="post-content">
                <div className="post-meta">
                  <span className="post-category">{post.category?.name}</span>
                  <div className="post-datetime">
                    <span className="post-date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span className="post-time">
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <h2 className="post-title">
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                </h2>
                <p className="post-excerpt">{post.excerpt || post.content?.substring(0, 120) + '...'}</p>
                <div className="post-footer">
                  <span className="post-author">By {post.author?.username}</span>
                  <Link to={`/posts/${post._id}`} className="read-more">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

