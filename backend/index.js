// backend/index.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import dotenv from 'dotenv';
import boards from './routes/boards.js';

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

// ... other imports

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors());

// Connect to the database
connectDB();

// Middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api', taskRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/boards', boards);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Socket.io setup
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Join a chat room
  socket.on('join-chat', (taskId) => {
    socket.join(`task-${taskId}`);
    console.log(`User joined chat for task ${taskId}`);
  });

  // Leave a chat room
  socket.on('leave-chat', (taskId) => {
    socket.leave(`task-${taskId}`);
    console.log(`User left chat for task ${taskId}`);
  });

  // Handle new message
  socket.on('send-message', (data) => {
    // Broadcast to all clients in the room except sender
    socket.to(`task-${data.taskId}`).emit('receive-message', data.message);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});