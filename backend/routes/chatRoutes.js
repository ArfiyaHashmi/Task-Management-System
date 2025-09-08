import express from 'express';
import { getChatByTaskId, addMessage, getTasksWithChats } from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth middleware to all chat routes
router.use(authMiddleware);

// Get all tasks with chat information
router.get('/tasks-with-chats', getTasksWithChats);

// Get chat for a specific 
// 3task
router.get('/:taskId', getChatByTaskId);

// Add message to chat
router.post('/:taskId/messages', addMessage);

export default router;
