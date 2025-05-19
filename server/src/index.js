import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes (we'll create these next)
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://task-manager-ai.netlify.app/'],
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 