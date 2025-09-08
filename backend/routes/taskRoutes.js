import express from 'express';
import { createTask, getTasks, deleteTask, updateTask, getClientTasks } from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Tasks routes
router.post('/tasks', createTask);
router.get('/tasks', getTasks);
router.delete('/tasks/:id', deleteTask);
router.put('/tasks/:id', updateTask);
router.get('/tasks/client-tasks', authMiddleware, getClientTasks); // Updated path

export default router;