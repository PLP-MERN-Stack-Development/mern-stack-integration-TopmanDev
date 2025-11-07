# 🌟 Nigerian Blog Posts Seeder

This guide will help you populate your blog with exciting posts about the latest happenings in Nigeria!

## 📋 What's Included

The seed script will add **10 amazing blog posts** covering:

1. 🏦 **Economy & Business** - Nigeria's GDP growth and economic recovery
2. 🚄 **Infrastructure** - Lagos-Ibadan railway project
3. 💰 **Technology** - Nigerian fintech startup funding success
4. 🎬 **Entertainment** - Nollywood's global expansion
5. ⚽ **Sports** - Super Eagles World Cup qualification
6. 🔬 **Health** - Revolutionary malaria vaccine development
7. 🏙️ **Smart Cities** - Abuja's technological transformation
8. 🎓 **Education** - Students excelling at international competitions
9. 🏢 **Real Estate** - Eko Atlantic City development
10. 💳 **Digital Innovation** - National digital identity platform

## 🖼️ Features

- ✅ Real, high-quality images from Unsplash
- ✅ Engaging, well-written content
- ✅ Proper categories (News, Business, Technology, etc.)
- ✅ Relevant tags for each post
- ✅ Ready-to-publish posts
- ✅ Automatic author account creation

## 🚀 How to Run the Seeder

### Step 1: Create .env file

If you don't have a `.env` file in the server folder, create one:

```bash
cd server
copy env.example .env
```

Then edit the `.env` file with your MongoDB connection string.

### Step 2: Ensure MongoDB is Running

Make sure your MongoDB database is running:
- **Local MongoDB**: Check if MongoDB service is running
- **MongoDB Atlas**: Ensure your connection string is correct in `.env`

### Step 3: Run the Seed Script

```bash
npm run seed
```

Or directly:

```bash
node seedPosts.js
```

## 🔐 Default Login Credentials

After seeding, you can login with:

- **Email**: `admin@topmanblog.com`
- **Password**: `Admin@123`

**⚠️ IMPORTANT**: Change this password after first login!

## 📝 What Happens When You Run the Seeder?

1. Connects to your MongoDB database
2. Creates categories (News, Business, Technology, etc.)
3. Creates a default admin user
4. Adds 10 blog posts with images
5. Links posts to appropriate categories
6. Sets all posts as published and ready to view

## 🔄 Running Multiple Times

The script is smart! It won't create duplicate posts if you run it again. It checks for existing posts by title.

## 🎨 Customization

Want to modify the posts? Edit the `nigerianPosts` array in `seedPosts.js`:

```javascript
const nigerianPosts = [
  {
    title: "Your Title Here",
    content: "Your content...",
    excerpt: "Short summary...",
    featuredImage: "https://your-image-url.com",
    tags: ["Tag1", "Tag2"],
    category: "Technology",
    isPublished: true,
  },
  // Add more posts...
];
```

## 🖼️ Changing Images

All images are from Unsplash (free to use). To change an image:

1. Go to [Unsplash](https://unsplash.com)
2. Search for your desired image
3. Copy the image URL (add `?w=800&q=80` for optimization)
4. Replace the `featuredImage` URL in the post

## 🐛 Troubleshooting

### Error: "Cannot connect to MongoDB"
- Check if MongoDB is running
- Verify your MONGODB_URI in `.env` file
- Check network connection (if using MongoDB Atlas)

### Error: "User validation failed"
- Check if User model has password hashing in pre-save hook
- Ensure bcryptjs is installed: `npm install bcryptjs`

### Posts not showing up
- Check if posts are marked as `isPublished: true`
- Verify categories were created successfully
- Check browser console for errors

## 📚 Next Steps

After seeding:

1. Start your server: `npm run dev`
2. Start your client: `cd ../client && npm run dev`
3. Login with the credentials above
4. Create more posts or edit existing ones
5. Enjoy your beautiful rainbow-themed blog! 🌈

## 💡 Tips

- The seed script is idempotent (safe to run multiple times)
- All posts are pre-written and ready to publish
- Images load from Unsplash CDN (fast and reliable)
- Posts include proper SEO with excerpts and tags

---

**Happy Blogging! 🎉**
