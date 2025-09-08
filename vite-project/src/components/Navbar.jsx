import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, User } from 'lucide-react';
import AuthContext from '../context/authContext';

const Navbar = () => {
    const authContext = useContext(AuthContext);
    const { logout, user } = authContext;
    const navigate = useNavigate();

    const onLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gradient-to-r from-[#006663] to-[#111111] text-white shadow-lg">
            <div className="max-w-full px-6 py-4 flex items-center justify-between">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3"
                >
                    <div className="p-2 rounded-full bg-white/10">
                        <User size={20} className="text-white/90" />
                    </div>
                    {user && (
                        <div className="flex flex-col">
                            <span className="font-medium text-sm text-white/80">Welcome,</span>
                            <span className="font-semibold text-white">
                                {user.name}
                                <span className="ml-1 text-sm font-medium text-white/60">
                                    ({user.role.charAt(0).toUpperCase() + user.role.slice(1)})
                                </span>
                            </span>
                        </div>
                    )}
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg
                        bg-red-500/20 hover:bg-red-500/30
                        transition-all duration-200
                        text-red-100 hover:text-white
                        border border-red-500/30 hover:border-red-500/50
                        focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                    <span className="text-sm font-medium">Logout</span>
                    <LogOut size={18} />
                </motion.button>
            </div>
        </nav>
    );
};

export default Navbar;
