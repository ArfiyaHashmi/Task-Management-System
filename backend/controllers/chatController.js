import Chat from '../models/chatModel.js';
import User from '../models/user.js';
import Task from '../models/taskModel.js';

// Get chat for a specific task
export const getChatByTaskId = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Find existing chat or create a new one
    let chat = await Chat.findOne({ taskId })
      .populate('participants', 'name role')
      .populate('messages.sender', 'name role');

    if (!chat) {
      // Get task to verify it exists
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Create new chat
      chat = new Chat({
        taskId,
        participants: [],
        messages: []
      });
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error getting chat:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add message to chat
export const addMessage = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    // Find chat
    let chat = await Chat.findOne({ taskId });

    if (!chat) {
      // Get task to verify it exists
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Create new chat
      chat = new Chat({
        taskId,
        participants: [senderId],
        messages: []
      });
    }

    // Add sender to participants if not already included
    if (!chat.participants.includes(senderId)) {
      chat.participants.push(senderId);
    }

    // Add message
    chat.messages.push({
      sender: senderId,
      content,
      timestamp: new Date()
    });

    await chat.save();

    // Populate sender info for the new message
    const populatedChat = await Chat.findById(chat._id)
      .populate('participants', 'name role')
      .populate('messages.sender', 'name role');

    // Get the newly added message
    const newMessage = populatedChat.messages[populatedChat.messages.length - 1];

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks for a user that have chats
export const getTasksWithChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let tasks;

    if (userRole === 'manager') {
      // Managers can see all tasks
      tasks = await Task.find().sort({ createdAt: -1 });
    } else if (userRole === 'employee') {
      // Employees can see all tasks for now
      // In a real app, you might want to filter by team or department
      tasks = await Task.find().sort({ createdAt: -1 });
    } else {
      // Clients can only see their own tasks
      tasks = await Task.find({ clientId: userId }).sort({ createdAt: -1 });
    }

    // Get chats for these tasks
    const chats = await Chat.find({
      taskId: { $in: tasks.map(task => task._id) }
    });

    // Create a map of taskId to chat
    const chatMap = {};
    chats.forEach(chat => {
      chatMap[chat.taskId.toString()] = {
        chatId: chat._id,
        messageCount: chat.messages.length
      };
    });

    // Add chat info to tasks
    const tasksWithChatInfo = tasks.map(task => {
      const taskObj = task.toObject();
      taskObj.chat = chatMap[task._id.toString()] || null;
      return taskObj;
    });

    res.status(200).json(tasksWithChatInfo);
  } catch (error) {
    console.error('Error getting tasks with chats:', error);
    res.status(500).json({ error: error.message });
  }
};
