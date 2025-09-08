import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#588157] to-[#3A5A40] relative">
            {/* Background Image */}
            <div 
                className="absolute inset-0 z-0" 
                style={{
                    backgroundImage: "url('/task-management-home.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: '0.4'  // Adjust opacity as needed
                }}
            ></div>

            {/* Content wrapper with relative positioning */}
            <div className="relative z-10">
                {/* Navigation */}
                <nav className="bg-gradient-to-r from-[#344E41] to-[#1B2921] text-white py-4 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <h1 className="text-2xl font-bold tracking-wider">Task Management System</h1>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/login')}
                            className="bg-[#A3B18A] hover:bg-[#588157] text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300 shadow-md"
                        >
                            Login
                        </motion.button>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl tracking-tight">
                                Welcome to{' '}
                                <span className="text-[#DAD7CD] font-bold drop-shadow-lg">
                                    Task Management System
                                </span>
                            </h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-3 max-w-md mx-auto text-base text-white font-medium sm:text-lg md:mt-5 md:text-xl md:max-w-3xl drop-shadow-md"
                        >
                            Streamline your workflow, manage tasks efficiently, and collaborate seamlessly with your team.
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;