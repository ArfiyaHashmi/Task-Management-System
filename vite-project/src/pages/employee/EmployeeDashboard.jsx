import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { motion } from 'framer-motion';
import { FiClock, FiCalendar, FiUsers, FiEdit } from 'react-icons/fi';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/users/me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUserInfo(data);
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    };

    fetchUserInfo();
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/api/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }

        const data = await response.json();
        setTasks(data);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
  };

  const handleUpdateStatus = async (taskId) => {
    try {
        if (!updatedStatus) {
            alert('Please select a status');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Debug log
        console.log('Updating task:', taskId, 'with status:', updatedStatus);

        const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: 'PUT', // Changed from PATCH to PUT
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: updatedStatus })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to update task');
        }

        // Update the tasks state with the new status
        setTasks(tasks.map(task => 
            task._id === taskId 
                ? { ...task, status: updatedStatus } 
                : task
        ));

        // Reset the form
        setEditingTask(null);
        setUpdatedStatus('');

        // Refresh tasks list
        fetchTasks();

    } catch (error) {
        console.error('Error updating task:', error);
        alert(error.message);
    }
  };

  useEffect(() => {
    console.log('Tasks updated:', tasks);
  }, [tasks]);

  useEffect(() => {
    console.log('Status being updated to:', updatedStatus);
  }, [updatedStatus]);

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
                  <h1 className="text-4xl font-bold text-gray-800">Employee Dashboard</h1>
                  <p className="mt-2 text-gray-600">Welcome! Here's your workspace.</p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-[#006663] to-[#111111] backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/10"
                >
                  <div className="flex items-center">
                    <div className="p-3 bg-white/10 rounded-lg">
                      <FiClock className="h-6 w-6 text-white/90" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-sm font-medium text-white/80">Active Tasks</h2>
                      <p className="text-2xl font-semibold text-white">{tasks.length}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Tasks Grid */}
            <div className="max-w-10xl mx-auto">
              <div className="bg-gradient-to-r from-[#006663] to-[#111111] backdrop-blur-sm 
                              rounded-2xl shadow-lg p-6 border border-white/10">
                <h2 className="text-2xl font-semibold text-white mb-6">Current Tasks</h2>
                <div className="grid gap-6">
                  {tasks.map((task) => (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={task._id}
                      className="bg-white/95 backdrop-blur-sm p-6 rounded-xl 
                               hover:shadow-lg transition-all duration-300 
                               border border-white/20 group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-3">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {task.name}
                          </h3>
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
                            <span className="px-3 py-1.5 bg-[#006663]/10 text-[#006663] 
                                           rounded-full text-sm border border-[#006663]/20">
                              {task.clientName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-medium shadow-sm
                              ${task.status === 'pending' ? 'bg-[#fad2d5] text-[#e63946]' : 
                              task.status === 'in-progress' ? 'bg-[#cae9ff] text-[#457b9d]' : 
                              'bg-[#a8e6cf] text-[#2a9d8f]'}`}>
                            {task.status}
                          </span>
                          
                          {/* Only show update button if task is assigned to current user */}
                          {task.team === userInfo?.name && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setEditingTask(task._id)}
                              className="flex items-center text-[#457b9d] hover:text-[#1d3557] 
                                       transition-all duration-200 font-medium"
                            >
                              <FiEdit className="mr-1.5" />
                              Update Status
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Edit Task Status Modal */}
            {editingTask && (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 overflow-y-auto"
    >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 transition-opacity"></div>

            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-white rounded-xl w-full max-w-md p-8 shadow-xl"
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Task Status</h2>
                <select
                    value={updatedStatus}
                    onChange={(e) => setUpdatedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 
                             focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                >
                    <option value="">Select Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                <div className="flex justify-end space-x-4 mt-6">
                    <button
                        onClick={() => {
                            setEditingTask(null);
                            setUpdatedStatus('');
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg
                                 hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleUpdateStatus(editingTask)}
                        className="px-4 py-2 bg-[#006663] text-white rounded-lg
                                 hover:bg-[#005450] transition-colors"
                    >
                        Update
                    </button>
                </div>
            </motion.div>
        </div>
    </motion.div>
)}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashboard;