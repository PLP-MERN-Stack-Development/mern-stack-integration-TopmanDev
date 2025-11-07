// verifyPosts.js - Quick script to verify posts were created

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');
const Category = require('./models/Category');

dotenv.config();

async function verifyPosts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const postCount = await Post.countDocuments();
    const categoryCount = await Category.countDocuments();
    
    console.log(`📊 Database Statistics:`);
    console.log(`   Posts: ${postCount}`);
    console.log(`   Categories: ${categoryCount}\n`);

    if (postCount > 0) {
      console.log('📝 Recent Posts:');
      const posts = await Post.find()
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title category isPublished createdAt');

      posts.forEach((post, index) => {
        console.log(`   ${index + 1}. ${post.title}`);
        console.log(`      Category: ${post.category.name}`);
        console.log(`      Published: ${post.isPublished ? '✅' : '❌'}`);
        console.log(`      Created: ${post.createdAt.toLocaleDateString()}\n`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyPosts();
