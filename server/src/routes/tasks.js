import express from 'express';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// Get all tasks for the authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const { category, status, sortBy = 'dueDate' } = req.query;
    
    // Build query
    const query = { user: req.user._id };
    if (category) query.category = category;
    if (status) query.status = status;

    // Build sort options
    const sortOptions = {};
    if (sortBy === 'dueDate') sortOptions.dueDate = 1;
    if (sortBy === 'createdAt') sortOptions.createdAt = -1;
    if (sortBy === 'category') sortOptions.category = 1;

    const tasks = await Task.find(query).sort(sortOptions);
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new task
router.post('/',
  protect,
  [
    body('title').trim().notEmpty(),
    body('category').optional().isIn(['Personal', 'Work', 'Urgent', 'Other']),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('dueDate').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = new Task({
        ...req.body,
        user: req.user._id
      });

      await task.save();
      res.status(201).json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update a task
router.put('/:id',
  protect,
  [
    body('title').optional().trim().notEmpty(),
    body('category').optional().isIn(['Personal', 'Work', 'Urgent', 'Other']),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('dueDate').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      Object.assign(task, req.body);
      await task.save();
      
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete a task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 