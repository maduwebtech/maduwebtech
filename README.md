# Madu Web Tech - Full Stack Coding Education Platform

A full-stack web application replicating the "Madu Web Tech" coding education platform. Built with React.js, Node.js, Express, MongoDB, and Tailwind CSS.

## Features

### Public Frontend
- **Home Page** with hero section, category cards, latest tutorials
- **Category Pages** with paginated posts
- **Single Post/Tutorial Page** with YouTube embed, comments
- **MCQ Quiz System** with score tracking
- **Search Functionality** across posts
- **About & Contact Pages**

### Admin Dashboard (Protected)
- **Authentication** with JWT
- **Posts Management** with CRUD operations
- **Categories Management**
- **MCQ Management** with question builder
- **Comments Moderation**
- **Settings** (site name, social links, etc.)
- **Media Library**

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose ODM
- JWT Authentication
- Cloudinary for image uploads
- Multer for file handling

### Frontend
- React.js + Vite
- Tailwind CSS
- React Router
- React Helmet Async (SEO)
- React Quill (Rich Text Editor)
- React Icons
- Axios

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account (for image uploads)

### Installation

1. **Clone and enter the project:**
```bash
cd maduwebtech
```

2. **Setup Backend:**
```bash
cd server
npm install
```

Create `.env` file in server folder:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maduwebtech
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@maduwebtech.com
ADMIN_PASSWORD=admin123
```

Start the server:
```bash
npm run dev
```

3. **Setup Frontend:**
```bash
cd ../client
npm install
npm run dev
```

### Default Admin Login
- Email: `admin@maduwebtech.com`
- Password: `admin123` (change in production)

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── admin/         # Admin pages
│   │   ├── api/           # API functions
│   │   ├── components/    # Shared components
│   │   ├── context/       # React contexts
│   │   ├── pages/         # Public pages
│   │   └── ...
├── server/                 # Express backend
│   ├── config/            # DB & Cloudinary config
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth, error handlers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── server.js          # Entry point
```

## Deployment

### Environment Variables
Make sure to set all environment variables for production:
- `MONGODB_URI`: Production MongoDB connection string
- `JWT_SECRET`: Strong secret key
- `CLOUDINARY_*`: Cloudinary credentials
- `ADMIN_*`: Admin credentials

### Build Frontend
```bash
cd client
npm run build
```

### Start Production Server
```bash
cd server
npm start
```

## License
MIT
