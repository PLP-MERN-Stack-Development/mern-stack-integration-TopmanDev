# 🌈 Topman Blog - MERN Stack Application

A beautiful, full-featured blog application built with MongoDB, Express.js, React.js, and Node.js, featuring a stunning rainbow gradient design and comprehensive REST API.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)

## ✨ Features

### Core Features
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete blog posts
- ✅ **User Authentication** - Secure registration and login with JWT
- ✅ **Category Management** - Organize posts by categories
- ✅ **Search & Filter** - Search posts by keywords, filter by category
- ✅ **Pagination** - Navigate through posts efficiently
- ✅ **Comments System** - Users can comment on posts
- ✅ **Image Support** - Upload and display featured images (local & external URLs)
- ✅ **Responsive Design** - Works perfectly on all devices

### UI Features
- 🌈 **Rainbow Gradient Design** - Beautiful animated backgrounds
- ✨ **Smooth Animations** - Hover effects and transitions
- 🎨 **Modern Layout** - Clean and intuitive interface
- 📱 **Mobile-Friendly** - Optimized for all screen sizes
- 🔍 **Real-time Search** - Instant search results with clear button
- 💫 **Loading States** - User-friendly loading indicators
- 🎯 **Compact Cards** - Portable, well-designed post cards (380px height)

### Advanced Features
- ✅ Protected routes for authenticated users
- ✅ Server-side post management (CLI tools)
- ✅ Optimistic UI updates
- ✅ Form validation (client & server)
- ✅ Post view count tracking
- ✅ Tag-based organization
- ✅ Database seeding with Nigerian content

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **Multer** - File upload handling

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool
- **Context API** - State management
- **CSS3** - Styling with gradients and animations

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Package manager
- **Git** - Version control

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mern-stack-integration-TopmanDev-main
```

### 2. Install Server Dependencies
```bash
cd server
npm install
```

### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

### 4. Set Up Environment Variables

**Server `.env` file** (in `server/` directory):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
MAX_FILE_SIZE=5000000
```

**Client `.env` file** (in `client/` directory):
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Seed the Database (Optional)
```bash
cd server
npm run seed
```
This creates:
- Admin user: `admin@topmanblog.com` / `Admin@123`
- 7 categories: News, Business, Technology, Sports, Health, Education, Entertainment
- 10 Nigerian blog posts with images

### 6. Start the Development Servers

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```
Server runs at: `http://localhost:5000`

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```
Client runs at: `http://localhost:3000`

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### 🔐 Authentication

All API responses follow this format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "count": 10  // For list endpoints
}
```

---

## 📝 Post Endpoints

### 1. Get All Blog Posts

**Endpoint:** `GET /api/posts`

**Description:** Retrieves all published blog posts with pagination support.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | Number | No | 1 | Page number |
| `limit` | Number | No | 10 | Posts per page |
| `category` | String | No | - | Filter by category slug |

**Example Request:**
```bash
curl http://localhost:5000/api/posts?page=1&limit=10&category=technology
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "pages": 3,
  "data": [
    {
      "_id": "673c3d8b5e2a1f4d8c9b6e21",
      "title": "Nigeria's Tech Startups Secure $2.3B in Funding",
      "content": "Full post content here...",
      "excerpt": "Nigerian tech ecosystem continues its remarkable growth trajectory...",
      "featuredImage": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
      "slug": "nigerias-tech-startups-secure-23b-in-funding",
      "author": {
        "_id": "673c3d8b5e2a1f4d8c9b6e1a",
        "username": "Admin",
        "email": "admin@topmanblog.com"
      },
      "category": {
        "_id": "673c3d8b5e2a1f4d8c9b6e1c",
        "name": "Technology",
        "slug": "technology"
      },
      "tags": ["startups", "funding", "innovation"],
      "isPublished": true,
      "viewCount": 150,
      "comments": [],
      "createdAt": "2025-11-07T10:00:00.000Z",
      "updatedAt": "2025-11-07T10:00:00.000Z"
    }
  ]
}
```

---

### 2. Get a Specific Blog Post

**Endpoint:** `GET /api/posts/:id`

**Description:** Retrieves a single blog post by ID or slug. Increments view count.

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | Yes | Post ID or slug |

**Example Request:**
```bash
curl http://localhost:5000/api/posts/673c3d8b5e2a1f4d8c9b6e21
# OR
curl http://localhost:5000/api/posts/nigerias-tech-startups-secure-23b-in-funding
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "673c3d8b5e2a1f4d8c9b6e21",
    "title": "Nigeria's Tech Startups Secure $2.3B in Funding",
    "content": "In a landmark year for Nigeria's technology sector, local startups have collectively raised $2.3 billion...",
    "excerpt": "Nigerian tech ecosystem continues its remarkable growth trajectory...",
    "featuredImage": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7",
    "slug": "nigerias-tech-startups-secure-23b-in-funding",
    "author": {
      "_id": "673c3d8b5e2a1f4d8c9b6e1a",
      "username": "Admin",
      "email": "admin@topmanblog.com"
    },
    "category": {
      "_id": "673c3d8b5e2a1f4d8c9b6e1c",
      "name": "Technology",
      "slug": "technology",
      "description": "Posts about Technology"
    },
    "tags": ["startups", "funding", "innovation"],
    "isPublished": true,
    "viewCount": 151,
    "comments": [
      {
        "_id": "673c4a2c8f3b2d5e9a7c8f32",
        "user": {
          "_id": "673c4a2c8f3b2d5e9a7c8f30",
          "username": "johndoe"
        },
        "content": "This is amazing news for Nigerian tech!",
        "createdAt": "2025-11-07T11:30:00.000Z"
      }
    ],
    "createdAt": "2025-11-07T10:00:00.000Z",
    "updatedAt": "2025-11-07T12:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Post not found"
}
```

---

### 3. Create a New Blog Post

**Endpoint:** `POST /api/posts`

**Description:** Creates a new blog post. Requires authentication.

**Authentication:** Bearer Token required

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | Yes | Post title (3-200 chars) |
| `content` | String | Yes | Post content (min 10 chars) |
| `excerpt` | String | No | Brief summary (max 500 chars) |
| `category` | String | Yes | Category ID |
| `tags` | Array | No | Array of tags |
| `featuredImage` | File/String | No | Image file or URL |
| `isPublished` | Boolean | No | Publish status (default: false) |

**Example Request (JavaScript):**
```javascript
const formData = new FormData();
formData.append('title', 'My New Blog Post');
formData.append('content', 'This is the full content of my blog post...');
formData.append('excerpt', 'A brief summary of the post');
formData.append('category', '673c3d8b5e2a1f4d8c9b6e1c');
formData.append('tags', JSON.stringify(['tech', 'innovation']));
formData.append('isPublished', 'true');
formData.append('featuredImage', imageFile); // or URL string

fetch('http://localhost:5000/api/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_jwt_token'
  },
  body: formData
});
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "673c5b3d9g4c3e6f0b8d7g43",
    "title": "My New Blog Post",
    "content": "This is the full content...",
    "excerpt": "A brief summary of the post",
    "slug": "my-new-blog-post",
    "author": "673c3d8b5e2a1f4d8c9b6e1a",
    "category": "673c3d8b5e2a1f4d8c9b6e1c",
    "tags": ["tech", "innovation"],
    "featuredImage": "/uploads/1699876543210-image.jpg",
    "isPublished": true,
    "viewCount": 0,
    "comments": [],
    "createdAt": "2025-11-07T14:00:00.000Z",
    "updatedAt": "2025-11-07T14:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Please provide title, content and category"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

---

### 4. Update an Existing Blog Post

**Endpoint:** `PUT /api/posts/:id`

**Description:** Updates an existing blog post. Only author can update.

**Authentication:** Bearer Token required

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | Yes | Post ID |

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
Same as POST `/api/posts` (all fields optional)

**Example Request:**
```bash
curl -X PUT http://localhost:5000/api/posts/673c3d8b5e2a1f4d8c9b6e21 \
  -H "Authorization: Bearer your_jwt_token" \
  -F "title=Updated Post Title" \
  -F "content=Updated content here..." \
  -F "isPublished=true"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "673c3d8b5e2a1f4d8c9b6e21",
    "title": "Updated Post Title",
    "content": "Updated content here...",
    // ... other updated fields
    "updatedAt": "2025-11-07T15:00:00.000Z"
  }
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "error": "User not authorized to update this post"
}
```

---

### 5. Delete a Blog Post

**Endpoint:** `DELETE /api/posts/:id`

**Description:** Deletes a blog post. Only author can delete.

**Authentication:** Bearer Token required

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | String | Yes | Post ID |

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Example Request:**
```bash
curl -X DELETE http://localhost:5000/api/posts/673c3d8b5e2a1f4d8c9b6e21 \
  -H "Authorization: Bearer your_jwt_token"
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {}
}
```

**Error Response (403 Forbidden):**
```json
{
  "success": false,
  "error": "User not authorized to delete this post"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Post not found"
}
```

---

## 📁 Category Endpoints

### 6. Get All Categories

**Endpoint:** `GET /api/categories`

**Description:** Retrieves all categories in the system.

**Example Request:**
```bash
curl http://localhost:5000/api/categories
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "_id": "673c3d8b5e2a1f4d8c9b6e1b",
      "name": "News",
      "slug": "news",
      "description": "Posts about News",
      "createdAt": "2025-11-07T10:00:00.000Z",
      "updatedAt": "2025-11-07T10:00:00.000Z"
    },
    {
      "_id": "673c3d8b5e2a1f4d8c9b6e1c",
      "name": "Technology",
      "slug": "technology",
      "description": "Posts about Technology",
      "createdAt": "2025-11-07T10:00:00.000Z",
      "updatedAt": "2025-11-07T10:00:00.000Z"
    },
    {
      "_id": "673c3d8b5e2a1f4d8c9b6e1d",
      "name": "Business",
      "slug": "business",
      "description": "Posts about Business",
      "createdAt": "2025-11-07T10:00:00.000Z",
      "updatedAt": "2025-11-07T10:00:00.000Z"
    }
  ]
}
```

---

### 7. Create a New Category

**Endpoint:** `POST /api/categories`

**Description:** Creates a new category. Requires authentication.

**Authentication:** Bearer Token required

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body (JSON):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | Yes | Category name (2-50 chars) |
| `description` | String | No | Category description |

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lifestyle",
    "description": "Posts about Lifestyle and Culture"
  }'
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "673c6d4e0h5d4f7g1c9e8h54",
    "name": "Lifestyle",
    "slug": "lifestyle",
    "description": "Posts about Lifestyle and Culture",
    "createdAt": "2025-11-07T16:00:00.000Z",
    "updatedAt": "2025-11-07T16:00:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Please provide a category name"
}
```

**Error Response (400 Bad Request - Duplicate):**
```json
{
  "success": false,
  "error": "Category already exists"
}
```

---

## 🔍 Additional Endpoints

### Search Posts
**Endpoint:** `GET /api/posts/search?q=technology`

**Description:** Search posts by title, content, excerpt, or tags.

**Example Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    // Array of matching posts
  ]
}
```

### Add Comment to Post
**Endpoint:** `POST /api/posts/:id/comments`

**Authentication:** Bearer Token required

**Request Body:**
```json
{
  "content": "Great post! Very informative."
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Updated post with new comment
  }
}
```

---

## 🖥️ Server-Side Post Management

Manage posts directly from the command line without using the UI:

### List All Posts
```bash
cd server
npm run posts list
```

### Create a New Post
```bash
npm run posts create
```

### Update a Post
```bash
npm run posts update <POST_ID>
```

### Delete a Post
```bash
npm run posts delete <POST_ID>
```

### Create Custom Post
1. Edit `server/createCustomPost.js`:
```javascript
const postData = {
  title: "Your Post Title",
  content: "Your full content here...",
  excerpt: "Brief summary",
  featuredImage: "https://images.unsplash.com/photo-...",
  tags: ["Tag1", "Tag2"],
  categoryName: "Technology",
  isPublished: true,
};
```

2. Run:
```bash
npm run create-post
```

---

## 📁 Project Structure

```
mern-stack-integration-TopmanDev-main/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Layout.jsx
│   │   │   ├── Layout.css
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/       # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/         # Custom hooks
│   │   │   └── useApi.js
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── PostView.jsx
│   │   │   ├── PostForm.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── services/      # API services
│   │   │   └── api.js
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Static files
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   │   ├── authController.js
│   │   ├── postController.js
│   │   └── categoryController.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── upload.js
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Category.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── posts.js
│   │   └── categories.js
│   ├── uploads/          # Uploaded files
│   ├── server.js         # Server entry point
│   ├── seedPosts.js      # Database seeder
│   ├── managePost.js     # Post management CLI
│   ├── createCustomPost.js
│   └── package.json
│
├── README.md             # This file
└── Week4-Assignment.md   # Assignment details
```

---

## 🎯 Features Implemented

✅ **Task 1: Project Setup**
- Clear directory structure for client and server
- MongoDB connection using Mongoose
- Express.js server with necessary middleware
- React front-end using Vite with proxy configuration
- Environment variables for configuration

✅ **Task 2: Back-End Development**
- RESTful API with all required endpoints
- Mongoose models for Post, Category, and User with relationships
- Input validation using Joi
- Comprehensive error handling middleware
- All 7 API endpoints documented above

✅ **Task 3: Front-End Development**
- React components for post list, single post, create/edit form
- React Router for navigation
- React hooks (useState, useEffect, useContext)
- Custom hook (useApi) for API calls
- Rainbow gradient design system

✅ **Task 4: Integration and Data Flow**
- API service in React for backend communication
- State management for posts and categories
- Forms with client and server validation
- Optimistic UI updates
- Loading and error states for all API calls

✅ **Task 5: Advanced Features**
- User authentication (registration, login, protected routes)
- Image uploads for blog post featured images
- Pagination for post list
- Searching and filtering functionality
- Comments feature for blog posts
- Server-side post management CLI
- Database seeding with Nigerian content

---

## 🎨 UI Design

### Rainbow Color Scheme
- **Primary Gradient:** `#667eea` → `#764ba2`
- **Secondary Gradient:** `#f093fb` → `#4facfe`
- **Accent:** `#00f2fe`
- **Animated Background:** `#ee7752` → `#e73c7e` → `#23a6d5` → `#23d5ab`

### Key Design Features
- ✨ Animated gradient backgrounds (15s loop)
- 🎯 Compact post cards (380px height)
- 🖼️ Image thumbnails (160px height)
- 📝 2-line content clamps
- 🔍 Clear search button with result counter
- 🎨 Gradient borders and hover effects
- 💫 Smooth transitions and animations

---

## 👥 Default Credentials

After running `npm run seed`:
- **Email:** `admin@topmanblog.com`
- **Password:** `Admin@123`

⚠️ **Change these credentials in production!**

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongod --version

# Start MongoDB (Windows)
# Go to Services and start MongoDB service

# Start MongoDB (Mac)
brew services start mongodb-community

# Start MongoDB (Linux)
sudo systemctl start mongod
```

### Port Already in Use
```powershell
# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
Stop-Process -Id <ProcessId>
```

### Clear npm Cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
Make sure your client `.env` has:
```env
VITE_API_URL=http://localhost:5000/api
```

And server is configured with CORS:
```javascript
app.use(cors());
```

---

## 📱 Usage Examples

### Creating a Post via UI
1. Navigate to `http://localhost:3000`
2. Login with admin credentials
3. Click "Create Post" button
4. Fill in title, content, select category
5. Upload featured image or use URL
6. Add tags (comma-separated)
7. Check "Publish post" checkbox
8. Click "Create Post"

### Searching Posts
1. Use search bar on home page
2. Enter keywords (searches title, content, tags)
3. Click search or press Enter
4. Click "✕" to clear search

### Filtering by Category
1. Use category dropdown on home page
2. Select a category
3. Posts automatically filter
4. Select "All Categories" to reset

---

## 📄 License

This project is part of the PLP Academy MERN Full Stack course and is for educational purposes.

---

## 👨‍💻 Author

**Topman**
- GitHub: [@TopmanDev](https://github.com/TopmanDev)
- Email: admin@topmanblog.com

---

## 🙏 Acknowledgments

- PLP Academy for the comprehensive MERN Stack curriculum
- Nigerian tech ecosystem for inspiring the blog content
- Unsplash for beautiful, free images

---

**Happy Blogging! 🎉🌈✨**

