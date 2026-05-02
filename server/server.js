import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import routes from './routes/index.js';
import errorHandler from './middleware/errorHandler.js';
import { User, Settings } from './models/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api', routes);

// API Root Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Madu Web Tech API',
    version: '1.0.0',
    endpoints: {
      posts: '/api/posts',
      categories: '/api/categories',
      mcqs: '/api/mcqs',
      admin: '/api/admin'
    }
  });
});

const PORT = process.env.PORT || 5000;

const createInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin'
      });
      console.log('Initial admin user created');
    }

    const settingsExist = await Settings.findOne();
    if (!settingsExist) {
      await Settings.create({
        siteName: 'Madu Web Tech',
        tagline: 'Learn Coding with Free Tutorials'
      });
      console.log('Initial settings created');
    }
  } catch (error) {
    console.error('Error creating initial data:', error);
  }
};

createInitialAdmin();

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
