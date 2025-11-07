// rebuildIndexes.js - Rebuild MongoDB indexes

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./models/Post');

dotenv.config();

const rebuildIndexes = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🗑️  Dropping old indexes...');
    await Post.collection.dropIndexes();
    console.log('✅ Old indexes dropped');

    console.log('🔨 Creating new indexes...');
    await Post.createIndexes();
    console.log('✅ New indexes created');

    console.log('\n📋 Current indexes:');
    const indexes = await Post.collection.getIndexes();
    Object.keys(indexes).forEach((indexName) => {
      console.log(`   - ${indexName}:`, JSON.stringify(indexes[indexName]));
    });

    console.log('\n✅ Index rebuild complete!');
    console.log('ℹ️  Users can now only create one post per title (slug + author unique)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

rebuildIndexes();
