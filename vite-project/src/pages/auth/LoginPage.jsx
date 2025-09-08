import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiLock, FiChevronDown } from 'react-icons/fi';
import AuthContext from '../../context/authContext';

const LoginPage = () => {
    const authContext = useContext(AuthContext);
    const { login, error, clearErrors, isAuthenticated, user } = authContext;
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('manager'); // Changed default to manager
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Add state for dropdown
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
        role: 'manager'
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate(`/${user.role}`); // Redirect based on authenticated user's role
        }

        if (error) {
            setTimeout(() => {
                clearErrors();
            }, 3000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user, navigate, error, clearErrors]);

    const { email, password, role } = credentials;

    const onChange = (e) =>
        setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleRoleSwitch = (role) => {
        setSelectedRole(role);
        setCredentials({ ...credentials, role }); // Update credentials when role changes
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log('Attempting login with:', credentials); // Debug log
        if (email && password && role) {
            await login({
                email,
                password,
                role
            });
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#eef5db] to-[#c8e7d1] p-4 relative">
            {/* Background Image */}
            <div 
                className="absolute inset-0 z-0" 
                style={{
                    backgroundImage: "url('/src/utils/task-management-home.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: '0.4'
                }}
            ></div>

            {/* Content wrapper with relative positioning */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-[#006663] to-[#111111] backdrop-blur-lg shadow-2xl rounded-3xl px-8 md:px-12 pt-12 pb-12 w-full max-w-2xl border border-white/20 relative z-10"
            >
                {/* Role Selector */}
                <div className="flex justify-end mb-8">
                    <div className="relative inline-block text-left">
                        <button
                            type="button"
                            onClick={toggleDropdown}
                            className="inline-flex items-center justify-center rounded-xl border border-gray-200 shadow-sm px-6 py-3 bg-white/90 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#02c39a] transition-all duration-300"
                        >
                            <FiUser className="mr-2" />
                            Login as: {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                            <FiChevronDown className="ml-2" />
                        </button>
                        
                        {isDropdownOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-white/95 backdrop-blur-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                            >
                                {['manager', 'employee', 'client'].map((role) => (
                                    <button
                                        key={role}
                                        onClick={() => handleRoleSwitch(role)}
                                        className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#02c39a] transition-all duration-200"
                                    >
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Title */}
                <motion.h2 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-white mb-8 text-center"
                >
                    Welcome Back
                    <span className="block text-lg text-[#f7fff7] mt-2 font-normal">Sign in to your account</span>
                </motion.h2>

                {/* Error Alert */}
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6"
                    >
                        <p className="text-red-700">{error}</p>
                    </motion.div>
                )}

                {/* Login Form */}
                <motion.form 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6" 
                    onSubmit={onSubmit}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[#f6fff8] text-sm font-semibold mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-6 py-3 rounded-xl border border-gray-200 focus:border-[#02c39a] focus:ring-2 focus:ring-[#02c39a] focus:ring-opacity-20 transition-all duration-200 outline-none text-white placeholder-gray-400"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[#f6fff8] text-sm font-semibold mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    className="w-full px-6 py-3 rounded-xl border border-gray-200 focus:border-[#02c39a] focus:ring-2 focus:ring-[#02c39a] focus:ring-opacity-20 transition-all duration-200 outline-none text-gray-100"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={onChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-[#40916c] to-[#2d6a4f] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#d8f3dc] focus:ring-opacity-50"
                        type="submit"
                    >
                        Sign In
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    );
};

export default LoginPage;