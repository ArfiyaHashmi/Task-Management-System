import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiUsers, FiClipboard } from 'react-icons/fi';

const ClientDashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchClientTasks();
    }, []);

    const fetchClientTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Token:', token); // Debug log

            const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/tasks/client-tasks`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status); // Debug log

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch tasks');
            }

            const data = await response.json();
            console.log('Fetched tasks:', data); // Debug log
            setTasks(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <div className="container mx-auto py-8 px-4">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Error: {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#f8fafc]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#e8f4f8] to-[#d1e8e2]">
                    <div className="container mx-auto px-6 py-8">
                        {/* Dashboard Header */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-4xl font-bold text-[#1d3557]">Client Dashboard</h1>
                                    <p className="mt-2 text-gray-600">Track your project tasks and progress</p>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#a8dadc]/30"
                                >
                                    <div className="flex items-center">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <FiClipboard className="h-6 w-6 text-[#457b9d]" />
                                        </div>
                                        <div className="ml-4">
                                            <h2 className="text-sm font-medium text-gray-600">Total Tasks</h2>
                                            <p className="text-2xl font-semibold text-[#1d3557]">{tasks.length}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Tasks Section */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#a8dadc]/30">
                            <h2 className="text-2xl font-semibold text-[#1d3557] mb-6">My Tasks</h2>
                            
                            {loading ? (
                                <div className="flex justify-center items-center py-8">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-6 h-6 border-2 border-[#457b9d] border-t-transparent rounded-full"
                                    />
                                </div>
                            ) : tasks.length === 0 ? (
                                <div className="text-center py-8">
                                    <FiClipboard className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="mt-4 text-gray-600">No tasks assigned yet.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {tasks.map((task) => (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            key={task._id}
                                            className="bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] p-6 rounded-xl 
                                                     hover:shadow-lg transition-all duration-300 
                                                     border-2 border-[#a8dadc]/40 hover:border-[#a8dadc]"
                                        >
                                            <div className="space-y-3">
                                                <h3 className="text-xl font-semibold text-[#1d3557]">{task.name}</h3>
                                                <div className="flex flex-wrap gap-4 text-sm">
                                                    <div className="flex items-center text-gray-600">
                                                        <FiUsers className="mr-2" />
                                                        <span>{task.team}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <FiCalendar className="mr-2" />
                                                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 mt-2">{task.description}</p>
                                                <div className="flex items-center mt-4">
                                                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm
                                                        ${task.status === 'pending' ? 'bg-[#fad2d5] text-[#e63946]' : 
                                                        task.status === 'in-progress' ? 'bg-[#cae9ff] text-[#457b9d]' : 
                                                        'bg-[#a8e6cf] text-[#2a9d8f]'}`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ClientDashboard;