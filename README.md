# MP-Dashboard: Task Management System

## Overview
MP-Dashboard is a comprehensive task management system designed to facilitate collaboration between managers, employees, and clients. The application provides role-based access control, real-time chat functionality, and task management features to streamline project workflows.

## Features

### User Management
- **Role-based Authentication**: Separate login flows for managers, employees, and clients
- **User Registration**: Managers can register new users with different roles
- **Secure Authentication**: JWT-based authentication with protected routes

### Task Management
- **Task Creation**: Managers can create tasks and assign them to teams
- **Task Assignment**: Tasks can be assigned to specific clients
- **Task Status Tracking**: Tasks can be marked as pending, in-progress, or completed
- **Task Details**: Comprehensive task information including deadlines and descriptions

### Real-time Chat
- **Project-specific Chats**: Managers and employees can discuss projects in real-time
- **Message History**: Chat history is preserved for future reference
- **Real-time Updates**: Socket.io integration for instant messaging

### Dashboard Views
- **Manager Dashboard**: Overview of all tasks and management capabilities
- **Employee Dashboard**: View and update assigned tasks
- **Client Dashboard**: View tasks assigned to the client

### Kanban Board
- **Visual Task Management**: Drag-and-drop interface for task status management
- **Custom Boards**: Create and customize boards for different project phases
- **Card Details**: Detailed view of task information

## Technology Stack

### Frontend
- **React**: UI library for building the user interface
- **React Router**: For navigation and routing
- **Socket.io Client**: For real-time communication
- **Tailwind CSS**: For styling and responsive design
- **Material UI**: Component library for UI elements
- **Vite**: Build tool and development server

### Backend
- **Node.js**: JavaScript runtime for the server
- **Express**: Web framework for handling HTTP requests
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: ODM for MongoDB
- **Socket.io**: For real-time bidirectional communication
- **JWT**: For authentication and authorization
- **bcrypt**: For password hashing

## Architecture
The application follows a client-server architecture:
- **Frontend**: Single-page application built with React
- **Backend**: RESTful API built with Express
- **Database**: MongoDB for data persistence
- **Real-time Communication**: Socket.io for instant messaging

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MP-Dashboard.git
cd MP-Dashboard
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../vite-project
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGO_URI=mongodb://localhost:27017/mp-dashboard
JWT_SECRET=your_secret_key
PORT=5000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd ../vite-project
npm run dev
```

3. Access the application at `http://localhost:5173`

### Login Instructions

1. After starting the application, navigate to the login page at `http://localhost:5173/login`

2. Use the following test credentials to log in with different roles:

   **Manager:**
   - Email: manager@example.com
   - Password: password123
   - Role: manager

   **Employee:**
   - Email: employee@example.com
   - Password: password123
   - Role: employee

   **Client:**
   - Email: client@example.com
   - Password: password123
   - Role: client

3. Select the appropriate role from the dropdown menu when logging in

4. After successful login, you will be redirected to the corresponding dashboard based on your role

5. To register new users (as a manager):
   - Log in as a manager
   - Click the "+ Register User" button on the manager dashboard
   - Fill in the required information and select a role
   - Click "Register" to create the new user

### Using the Chat Feature

1. Log in as a manager or employee (chat is not available for clients)

2. Click on the "Chat" option in the sidebar

3. Select a project from the list on the left side

4. Start sending messages in the chat window

5. All messages are saved and will be available when you return to the chat

6. Managers and employees can discuss project details in real-time

## User Roles and Permissions

### Manager
- Register new users
- Create and assign tasks
- View all tasks
- Chat with employees about projects
- Access analytics (future feature)

### Employee
- View assigned tasks
- Update task status
- Chat with managers about projects

### Client
- View tasks assigned to them
- Track task progress

## Project Structure

### Backend
- `models/`: Database schemas
- `controllers/`: Request handlers
- `routes/`: API endpoints
- `middleware/`: Authentication and validation middleware
- `config/`: Configuration files

### Frontend
- `src/components/`: Reusable UI components
- `src/pages/`: Page components for different routes
- `src/context/`: Context providers for state management
- `src/utils/`: Utility functions and API client

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Socket.io](https://socket.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/)
