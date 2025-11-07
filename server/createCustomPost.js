// createCustomPost.js - Easy script to create a custom post with your data

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const Category = require('./models/Category');
const User = require('./models/User');

dotenv.config();

// ============================================
// EDIT YOUR POST DATA HERE
// ============================================
const postData = {
  title: "Your Post Title Here",
  
  content: `Write your full post content here.

You can add multiple paragraphs.

Add as much detail as you want!`,

  excerpt: "A brief summary of your post (max 200 characters)",
  
  featuredImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&q=80",
  
  tags: ["Tag1", "Tag2", "Tag3"],
  
  categoryName: "Technology", // Options: News, Business, Technology, Entertainment, Sports, Health, Education
  
  isPublished: true, // true to publish immediately, false for draft
};
// ============================================

async function createCustomPost() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get author
    const author = await User.findOne({ email: 'admin@topmanblog.com' });
    if (!author) {
      console.log('❌ Admin user not found. Run: npm run seed');
      process.exit(1);
    }

    // Get category
    const category = await Category.findOne({ name: postData.categoryName });
    if (!category) {
      console.log(`❌ Category "${postData.categoryName}" not found`);
      console.log('Available categories: News, Business, Technology, Entertainment, Sports, Health, Education');
      process.exit(1);
    }

    // Create the post
    const post = await Post.create({
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt,
      featuredImage: postData.featuredImage,
      tags: postData.tags,
      category: category._id,
      author: author._id,
      isPublished: postData.isPublished,
    });

    console.log('✅ POST CREATED SUCCESSFULLY!\n');
    console.log(`   📝 Title: ${post.title}`);
    console.log(`   🆔 ID: ${post._id}`);
    console.log(`   🔗 Slug: ${post.slug}`);
    console.log(`   📁 Category: ${category.name}`);
    console.log(`   📅 Created: ${post.createdAt}`);
    console.log(`   ${post.isPublished ? '✅ Published' : '📝 Draft'}`);
    console.log('\n🌐 View in browser: http://localhost:3000/posts/' + post._id);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createCustomPost();
