# MP-Dashboard: Build Documentation

This document outlines the step-by-step process of building the MP-Dashboard application, including setup, implementation details, and key decisions made during development.

## Table of Contents
1. [Project Setup](#project-setup)
2. [Backend Development](#backend-development)
3. [Frontend Development](#frontend-development)
4. [Authentication System](#authentication-system)
5. [Task Management](#task-management)
6. [Chat System Implementation](#chat-system-implementation)
7. [Deployment Considerations](#deployment-considerations)

## Project Setup

### Initial Setup
1. Created project directory structure
   ```bash
   mkdir MP-Dashboard
   cd MP-Dashboard
   ```

2. Set up backend with Node.js and Express
   ```bash
   mkdir backend
   cd backend
   npm init -y
   npm install express mongoose dotenv bcryptjs jsonwebtoken cors express-validator
   ```

3. Set up frontend with Vite and React
   ```bash
   npm create vite@latest vite-project -- --template react
   cd vite-project
   npm install
   ```

4. Configured environment variables
   - Created `.env` file in backend directory with MongoDB connection string, JWT secret, and port

### Project Structure
- Organized backend with MVC pattern (Models, Controllers, Routes)
- Structured frontend with components, pages, and context providers

## Backend Development

### Database Setup
1. Created MongoDB connection in `config/db.js`
   ```javascript
   import mongoose from 'mongoose';
   import dotenv from 'dotenv';

   dotenv.config();

   const connectDB = async () => {
     try {
       await mongoose.connect(process.env.MONGO_URI);
       console.log('MongoDB Connected...');
     } catch (err) {
       console.error(err.message);
       process.exit(1);
     }
   };

   export default connectDB;
   ```

2. Defined Mongoose schemas for User, Task, and Chat models

### API Development
1. Implemented RESTful API endpoints for:
   - User authentication (register, login, get user)
   - Task management (create, read, update, delete)
   - Chat functionality (get chats, send messages)

2. Created middleware for authentication and error handling
   ```javascript
   // Authentication middleware
   const auth = (req, res, next) => {
     const token = req.header('x-auth-token') || req.header('Authorization')?.split(' ')[1];
     if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded.user;
       next();
     } catch (err) {
       res.status(401).json({ msg: 'Token is not valid' });
     }
   };
   ```

3. Implemented role-based access control for different user types

### Real-time Communication
1. Integrated Socket.io for real-time chat functionality
   ```javascript
   import { Server } from 'socket.io';
   
   const io = new Server(httpServer, {
     cors: {
       origin: "http://localhost:5173",
       methods: ["GET", "POST"]
     }
   });
   
   io.on('connection', (socket) => {
     console.log('A user connected:', socket.id);
     
     socket.on('join-chat', (taskId) => {
       socket.join(`task-${taskId}`);
     });
     
     socket.on('send-message', (data) => {
       socket.to(`task-${data.taskId}`).emit('receive-message', data.message);
     });
     
     socket.on('disconnect', () => {
       console.log('User disconnected:', socket.id);
     });
   });
   ```

## Frontend Development

### UI Framework Setup
1. Installed and configured Tailwind CSS for styling
   ```bash
   npm install tailwindcss @tailwindcss/vite
   ```

2. Set up Material UI components
   ```bash
   npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
   ```

3. Created responsive layouts for different screen sizes

### State Management
1. Implemented React Context API for global state management
   - Created AuthContext for user authentication
   - Created ChatContext for real-time messaging

2. Set up reducers for complex state logic
   ```javascript
   const authReducer = (state, action) => {
     switch (action.type) {
       case 'USER_LOADED':
         return {
           ...state,
           isAuthenticated: true,
           loading: false,
           user: action.payload
         };
       // Other cases...
     }
   };
   ```

### Routing
1. Configured React Router for navigation
   ```javascript
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/login" element={<LoginPage />} />
     <Route
       path="/manager"
       element={
         <PrivateRoute allowedRoles={['manager']}>
           <ManagerDashboard />
         </PrivateRoute>
       }
     />
     {/* Other routes... */}
   </Routes>
   ```

2. Implemented PrivateRoute component for protected routes
   ```javascript
   const PrivateRoute = ({ children, allowedRoles }) => {
     const { isAuthenticated, user } = useContext(AuthContext);
     
     if (!isAuthenticated) return <Navigate to="/login" />;
     if (allowedRoles && !allowedRoles.includes(user.role)) {
       return <div>Unauthorized</div>;
     }
     
     return children;
   };
   ```

### Component Development
1. Created reusable components:
   - Navbar for navigation
   - Sidebar for menu options
   - Modal for dialogs
   - Form components for data entry

2. Developed page components for different user roles:
   - ManagerDashboard
   - EmployeeDashboard
   - ClientDashboard
   - ChatPage
   - TasksPage

## Authentication System

### User Registration
1. Implemented registration form with validation
2. Created backend endpoint for user registration
3. Added password hashing with bcrypt
   ```javascript
   const salt = await bcrypt.genSalt(10);
   user.password = await bcrypt.hash(password, salt);
   ```

### User Login
1. Developed login form with role selection
2. Implemented JWT-based authentication
   ```javascript
   const payload = {
     user: {
       id: user.id,
       role: user.role
     }
   };
   
   jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
     if (err) throw err;
     res.json({ token });
   });
   ```

3. Set up token storage in localStorage and API headers

### Authorization
1. Created middleware to verify JWT tokens
2. Implemented role-based access control for routes and components
3. Set up automatic redirection based on user role

## Task Management

### Task Model
1. Defined task schema with fields:
   - name
   - team
   - clientName
   - clientId
   - deadline
   - description
   - status
   - createdAt

### Task Creation
1. Implemented form for managers to create tasks
2. Added client selection from registered clients
3. Created API endpoint for task creation

### Task Display
1. Developed task list components for different dashboards
2. Implemented filtering based on user role
3. Added task status indicators

### Task Updates
1. Created functionality for updating task status
2. Implemented task deletion for managers
3. Added task detail view

## Chat System Implementation

### Chat Model
1. Defined chat schema with fields:
   - taskId (reference to Task)
   - participants (array of User references)
   - messages (array of message objects)

2. Created message sub-schema:
   ```javascript
   const messageSchema = new mongoose.Schema({
     sender: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User',
       required: true
     },
     content: {
       type: String,
       required: true
     },
     timestamp: {
       type: Date,
       default: Date.now
     }
   });
   ```

### Real-time Communication
1. Integrated Socket.io on both frontend and backend
   ```bash
   # Backend
   npm install socket.io
   
   # Frontend
   npm install socket.io-client
   ```

2. Implemented chat rooms based on task IDs
3. Set up event listeners for message sending and receiving

### Chat UI
1. Created ChatPage component with:
   - Project selection sidebar
   - Message display area
   - Message input form

2. Implemented real-time message updates
3. Added message history loading

### Chat Context
1. Developed ChatContext for managing chat state:
   - Current task
   - Message history
   - Socket connection

2. Implemented actions for:
   - Fetching tasks with chats
   - Setting current task
   - Sending messages
   - Receiving messages

## Deployment Considerations

### Environment Configuration
1. Set up environment variables for:
   - MongoDB connection string
   - JWT secret
   - Port numbers
   - Production/development mode

### Security Measures
1. Implemented password hashing
2. Added JWT authentication
3. Set up CORS configuration
4. Used Helmet for HTTP security headers

### Performance Optimization
1. Implemented efficient database queries
2. Used React's memo and useCallback for component optimization
3. Set up proper error handling and logging

## Conclusion
The MP-Dashboard application was built following modern web development practices, with a focus on security, scalability, and user experience. The separation of concerns between frontend and backend, along with the use of real-time communication, provides a solid foundation for future enhancements and features.
