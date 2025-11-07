// managePost.js - Server-side script to create, update, and delete posts

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const Category = require('./models/Category');
const User = require('./models/User');

dotenv.config();

// Get command line arguments
const action = process.argv[2]; // create, update, delete, list
const postId = process.argv[3]; // for update and delete

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB\n');
}

// CREATE POST
async function createPost() {
  console.log('📝 CREATE NEW POST\n');
  
  // Get author
  const author = await User.findOne({ email: 'admin@topmanblog.com' });
  if (!author) {
    console.log('❌ Admin user not found. Please run seed script first.');
    return;
  }

  // Get categories
  const categories = await Category.find();
  console.log('Available Categories:');
  categories.forEach((cat, index) => {
    console.log(`  ${index + 1}. ${cat.name} (${cat._id})`);
  });

  // Example: Create a new post
  const newPost = {
    title: "Breaking: New Development in Nigeria",
    content: `This is an example post created from the server side.
    
You can edit this content to add your own information. The post includes full content with multiple paragraphs.

Key Features:
- Server-side post creation
- Automatic slug generation
- Category assignment
- Tag support
- Image URLs

This is a great way to quickly add content to your blog without using the UI!`,
    excerpt: "Example post demonstrating server-side post creation with full features.",
    featuredImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    tags: ["Tutorial", "Server-Side", "Management"],
    category: categories[0]._id, // Use first category
    author: author._id,
    isPublished: true,
  };

  const post = await Post.create(newPost);
  console.log('\n✅ Post created successfully!');
  console.log(`   ID: ${post._id}`);
  console.log(`   Title: ${post.title}`);
  console.log(`   Slug: ${post.slug}`);
  console.log(`   Category: ${categories[0].name}`);
  console.log(`\n📖 To edit this post, use: node managePost.js update ${post._id}`);
}

// UPDATE POST
async function updatePost(id) {
  console.log('✏️  UPDATE POST\n');
  
  const post = await Post.findById(id).populate('category');
  if (!post) {
    console.log('❌ Post not found');
    return;
  }

  console.log(`Current Post: ${post.title}`);
  console.log(`Category: ${post.category.name}`);
  console.log(`Published: ${post.isPublished}`);
  
  // Example update - modify these values as needed
  const updates = {
    title: post.title + " (Updated)",
    content: post.content + "\n\n✅ This post has been updated from the server side!",
    // Add more fields to update as needed
  };

  const updatedPost = await Post.findByIdAndUpdate(id, updates, { new: true });
  
  console.log('\n✅ Post updated successfully!');
  console.log(`   New Title: ${updatedPost.title}`);
}

// DELETE POST
async function deletePost(id) {
  console.log('🗑️  DELETE POST\n');
  
  const post = await Post.findById(id);
  if (!post) {
    console.log('❌ Post not found');
    return;
  }

  console.log(`Post to delete: ${post.title}`);
  
  await Post.findByIdAndDelete(id);
  
  console.log('✅ Post deleted successfully!');
}

// LIST ALL POSTS
async function listPosts() {
  console.log('📋 ALL POSTS\n');
  
  const posts = await Post.find()
    .populate('category', 'name')
    .populate('author', 'username')
    .sort({ createdAt: -1 });

  if (posts.length === 0) {
    console.log('No posts found.');
    return;
  }

  posts.forEach((post, index) => {
    console.log(`${index + 1}. [${post._id}] ${post.title}`);
    console.log(`   Category: ${post.category.name} | Author: ${post.author.username}`);
    console.log(`   Published: ${post.isPublished ? '✅' : '❌'} | Created: ${post.createdAt.toLocaleDateString()}`);
    console.log('');
  });

  console.log(`Total: ${posts.length} posts`);
}

// CUSTOM CREATE WITH PARAMETERS
async function customCreate(data) {
  const author = await User.findOne({ email: 'admin@topmanblog.com' });
  const categories = await Category.find();
  
  const postData = {
    title: data.title || "New Post Title",
    content: data.content || "Add your content here...",
    excerpt: data.excerpt || "Brief description of the post.",
    featuredImage: data.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
    tags: data.tags || ["General"],
    category: categories[0]._id,
    author: author._id,
    isPublished: data.published !== false,
  };

  const post = await Post.create(postData);
  console.log('✅ Custom post created!');
  console.log(`   ID: ${post._id}`);
  console.log(`   Title: ${post.title}`);
  return post;
}

// Main function
async function main() {
  try {
    await connectDB();

    switch (action) {
      case 'create':
        await createPost();
        break;
      
      case 'update':
        if (!postId) {
          console.log('❌ Please provide post ID: node managePost.js update <POST_ID>');
          break;
        }
        await updatePost(postId);
        break;
      
      case 'delete':
        if (!postId) {
          console.log('❌ Please provide post ID: node managePost.js delete <POST_ID>');
          break;
        }
        await deletePost(postId);
        break;
      
      case 'list':
        await listPosts();
        break;
      
      default:
        console.log('📚 POST MANAGEMENT SCRIPT\n');
        console.log('Usage:');
        console.log('  node managePost.js list          - List all posts');
        console.log('  node managePost.js create        - Create a new post');
        console.log('  node managePost.js update <ID>   - Update a post');
        console.log('  node managePost.js delete <ID>   - Delete a post');
        console.log('\nExamples:');
        console.log('  node managePost.js list');
        console.log('  node managePost.js create');
        console.log('  node managePost.js update 507f1f77bcf86cd799439011');
        console.log('  node managePost.js delete 507f1f77bcf86cd799439011');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
