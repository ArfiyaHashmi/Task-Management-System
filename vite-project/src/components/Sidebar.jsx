import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Home,
  MessageSquare,
  ListTodo,
  BarChart2,
  LogOut,
} from 'lucide-react';
import AuthContext from '../context/authContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const { user } = authContext;

  // Set active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.includes('/tasks')) return 'Tasks';
    if (path.includes('/chat')) return 'Chat';
    // if (path.includes('/analytics')) return 'Analytics';
    return 'Home';
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (itemName) => {
    setActiveItem(itemName);

    // Navigate based on the item clicked
    switch (itemName) {
      case 'Home':
        navigate('/');
        break;
      case 'Tasks':
        navigate('/tasks');
        break;
      case 'Chat':
        navigate('/chat');
        break;
      // case 'Analytics':
      //   // Add navigation for Analytics when implemented
      //   break;
      default:
        break;
    }
  };

  // Filter menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { name: 'Home', icon: <Home size={20} /> },
      { name: 'Tasks', icon: <ListTodo size={20} /> },
    ];

    // Only managers and employees can access chat
    if (user && (user.role === 'manager' || user.role === 'employee')) {
      baseItems.splice(1, 0, { name: 'Chat', icon: <MessageSquare size={20} /> });
    }

    // Only managers can access analytics (when implemented)
    // if (user && user.role === 'manager') {
    //   baseItems.push({ name: 'Analytics', icon: <BarChart2 size={20} /> });
    // }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      className={`fixed top-19.5 left-0 h-[calc(100vh-4rem)] 
        bg-gradient-to-b from-[#006663] to-[#111111]
        text-white transition-all duration-300 z-30
        ${isOpen ? 'w-64' : 'w-16'} 
        overflow-hidden shadow-xl
        border-r border-white/5`}
    >
      {/* Hamburger button with hover effect */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleSidebar}
        className="absolute top-4 left-4 text-white/80 hover:text-white
          focus:outline-none transition-all duration-200"
      >
        <Menu size={24} />
      </motion.button>

      {/* Menu Items Container */}
      <div className="mt-16 space-y-2 px-3">
        <AnimatePresence>
          {menuItems.map((item) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              whileHover={{ x: 5 }}
              onClick={() => handleItemClick(item.name)}
              className={`
                flex items-center gap-4 cursor-pointer
                rounded-xl px-4 py-3
                transition-all duration-200 ease-in-out
                backdrop-blur-sm
                ${activeItem === item.name
                  ? 'bg-[#2d3748]/50 text-white shadow-lg'
                  : 'hover:bg-[#2d3748]/30 text-white/70 hover:text-white'}
              `}
            >
              <motion.div
                whileHover={{ rotate: 10 }}
                className={`${activeItem === item.name ? 'text-white' : 'text-white/80'}`}
              >
                {item.icon}
              </motion.div>
              
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-sm font-medium tracking-wide
                    ${activeItem === item.name ? 'text-white' : 'text-white/80'}`}
                >
                  {item.name}
                </motion.span>
              )}

              {activeItem === item.name && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 w-1 h-8 bg-white rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Logout Button at Bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4
          border-t border-white/5 bg-gradient-to-t from-[#121620] to-transparent"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          className="flex items-center gap-3 w-full px-4 py-2.5 
            rounded-lg text-white/70 hover:text-white
            hover:bg-[#2d3748]/30 transition-all duration-200"
        >
          <LogOut size={20} />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;