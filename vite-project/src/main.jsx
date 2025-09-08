import { StrictMode } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AuthState from './context/authState';
import { ChatProvider } from './context/chatContext';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <AuthState>
      <Router>
        <ChatProvider>
          <App />
        </ChatProvider>
      </Router>
    </AuthState>
  </StrictMode>
);