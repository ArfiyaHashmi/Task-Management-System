import React, { createContext, useReducer, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import api from '../utils/api';
import AuthContext from './authContext';

// Create context
export const ChatContext = createContext();

// Initial state
const initialState = {
  socket: null,
  connected: false,
  currentTask: null,
  tasks: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null
};

// Action types
const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
const SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED';
const SET_CURRENT_TASK = 'SET_CURRENT_TASK';
const SET_TASKS = 'SET_TASKS';
const SET_CURRENT_CHAT = 'SET_CURRENT_CHAT';
const SET_MESSAGES = 'SET_MESSAGES';
const ADD_MESSAGE = 'ADD_MESSAGE';
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';

// Reducer
const chatReducer = (state, action) => {
  switch (action.type) {
    case SOCKET_CONNECTED:
      return {
        ...state,
        socket: action.payload,
        connected: true
      };
    case SOCKET_DISCONNECTED:
      return {
        ...state,
        socket: null,
        connected: false
      };
    case SET_CURRENT_TASK:
      return {
        ...state,
        currentTask: action.payload
      };
    case SET_TASKS:
      return {
        ...state,
        tasks: action.payload
      };
    case SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: action.payload
      };
    case SET_MESSAGES:
      return {
        ...state,
        messages: action.payload
      };
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.payload]
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

// Provider component
export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const authContext = useContext(AuthContext);
  const { isAuthenticated, user } = authContext;

  // Initialize socket connection when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = io('http://localhost:5000');
      
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        dispatch({ type: SOCKET_CONNECTED, payload: socket });
      });
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        dispatch({ type: SOCKET_DISCONNECTED });
      });
      
      socket.on('receive-message', (message) => {
        dispatch({ type: ADD_MESSAGE, payload: message });
      });
      
      // Clean up on unmount
      return () => {
        if (socket) {
          socket.disconnect();
        }
      };
    }
  }, [isAuthenticated, user]);

  // Fetch tasks with chat info
  const fetchTasksWithChats = async () => {
    try {
      dispatch({ type: SET_LOADING, payload: true });
      const response = await api.get('/api/chats/tasks-with-chats');
      dispatch({ type: SET_TASKS, payload: response.data });
      dispatch({ type: SET_LOADING, payload: false });
    } catch (error) {
      console.error('Error fetching tasks with chats:', error);
      dispatch({ type: SET_ERROR, payload: error.response?.data?.error || 'Failed to fetch tasks' });
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  // Set current task and join chat room
  const setCurrentTask = async (task) => {
    try {
      if (state.currentTask && state.socket) {
        // Leave previous chat room
        state.socket.emit('leave-chat', state.currentTask._id);
      }
      
      dispatch({ type: SET_CURRENT_TASK, payload: task });
      
      if (task && state.socket) {
        // Join new chat room
        state.socket.emit('join-chat', task._id);
        
        // Fetch chat for this task
        dispatch({ type: SET_LOADING, payload: true });
        const response = await api.get(`/api/chats/${task._id}`);
        dispatch({ type: SET_CURRENT_CHAT, payload: response.data });
        dispatch({ type: SET_MESSAGES, payload: response.data.messages || [] });
        dispatch({ type: SET_LOADING, payload: false });
      } else {
        dispatch({ type: SET_CURRENT_CHAT, payload: null });
        dispatch({ type: SET_MESSAGES, payload: [] });
      }
    } catch (error) {
      console.error('Error setting current task:', error);
      dispatch({ type: SET_ERROR, payload: error.response?.data?.error || 'Failed to load chat' });
      dispatch({ type: SET_LOADING, payload: false });
    }
  };

  // Send a message
  const sendMessage = async (content) => {
    try {
      if (!state.currentTask) {
        throw new Error('No task selected');
      }
      
      const taskId = state.currentTask._id;
      
      // Send to API
      const response = await api.post(`/api/chats/${taskId}/messages`, { content });
      const newMessage = response.data;
      
      // Add to local state
      dispatch({ type: ADD_MESSAGE, payload: newMessage });
      
      // Emit to socket
      if (state.socket) {
        state.socket.emit('send-message', {
          taskId,
          message: newMessage
        });
      }
      
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      dispatch({ type: SET_ERROR, payload: error.response?.data?.error || 'Failed to send message' });
      throw error;
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: SET_ERROR, payload: null });
  };

  return (
    <ChatContext.Provider
      value={{
        socket: state.socket,
        connected: state.connected,
        currentTask: state.currentTask,
        tasks: state.tasks,
        currentChat: state.currentChat,
        messages: state.messages,
        loading: state.loading,
        error: state.error,
        fetchTasksWithChats,
        setCurrentTask,
        sendMessage,
        clearError
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
