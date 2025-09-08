import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiCalendar, FiUsers, FiClock } from 'react-icons/fi';

const ManagerDashboard = () => {
    const [showForm, setShowForm] = useState(false);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [employeesLoading, setEmployeesLoading] = useState(true);
    const [taskData, setTaskData] = useState({
        name: '',
        employeeName: '', // Changed from team to employeeName
        employeeId: '', // Added employeeId
        clientName: '',
        deadline: '',
        description: ''
    });
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const [error, setError] = useState(null);

    // Fetch tasks and clients on component mount
    useEffect(() => {
        const fetchInitialData = async () => {
            await Promise.all([
                fetchTasks(),
                fetchClients(),
                fetchEmployees()
            ]);
        };
        fetchInitialData();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tasks');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/clients');
            if (!response.ok) throw new Error('Failed to fetch clients');
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const fetchEmployees = async () => {
        try {
            setEmployeesLoading(true);
            const token = localStorage.getItem('token');
            
            // Add console.log to check token
            console.log('Token:', token);
            
            const response = await fetch('http://localhost:5000/api/auth/employees', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Add console.log to check response
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched employees data:', data);
            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setEmployees([]); // Set empty array on error
        } finally {
            setEmployeesLoading(false);
        }
    };

    // Add this after fetchEmployees is called
    useEffect(() => {
        console.log('Employees state updated:', employees);
    }, [employees]);

    const deleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                    method: 'DELETE',
                });
                
                if (!response.ok) throw new Error('Failed to delete task');
                
                setTasks(tasks.filter(task => task._id !== taskId));
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'employeeName') {
            const selectedEmployee = employees.find(emp => emp.name === value);
            setTaskData({
                ...taskData,
                employeeName: value,
                employeeId: selectedEmployee ? selectedEmployee._id : ''
            });
        } else {
            setTaskData({ ...taskData, [name]: value });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate all required fields
            if (!taskData.name?.trim()) {
                throw new Error('Task name is required');
            }
            if (!taskData.employeeName) {
                throw new Error('Please select an employee');
            }
            if (!taskData.clientName) {
                throw new Error('Please select a client');
            }
            if (!taskData.deadline) {
                throw new Error('Deadline is required');
            }
            if (!taskData.description?.trim()) {
                throw new Error('Description is required');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const selectedEmployee = employees.find(emp => emp.name === taskData.employeeName);
            if (!selectedEmployee) {
                throw new Error('Invalid employee selection');
            }

            const selectedClient = clients.find(client => client.name === taskData.clientName);
            if (!selectedClient) {
                throw new Error('Invalid client selection');
            }

            console.log('Selected Employee:', selectedEmployee);
            console.log('Selected Client:', selectedClient);

            const taskPayload = {
                name: taskData.name.trim(),
                employeeName: selectedEmployee.name,
                employeeId: selectedEmployee._id,
                clientName: selectedClient.name,
                clientId: selectedClient._id,
                deadline: new Date(taskData.deadline).toISOString(),
                description: taskData.description.trim(),
                status: 'pending'
            };

            console.log('Sending task payload:', taskPayload);

            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskPayload)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to create task');
            }

            // Success handling
            setTasks(prevTasks => [...prevTasks, data]);
            setTaskData({
                name: '',
                employeeName: '',
                employeeId: '',
                clientName: '',
                deadline: '',
                description: ''
            });
            setShowForm(false);
            setError(null);

        } catch (error) {
            console.error('Error creating task:', error);
            setError(error.message);
        }
    };

    const handleRegisterUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Registration failed');
            }

            setShowRegisterForm(false);
            setUserData({ name: '', email: '', password: '', role: '' });
            alert('User registered successfully');
        } catch (error) {
            console.error('Registration error:', error);
            alert(error.message);
        }
    };

    return (
        <div className="flex h-screen bg-[#f8fafc]">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#f1f5f9] to-[#e2e8f0]">
                    <div className="container mx-auto px-6 py-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row md:items-center md:justify-between"
                        >
                            {/* Dashboard Header */}
                            <div>
                                <h1 className="text-4xl font-bold text-gray-800">Manager Dashboard</h1>
                                <p className="mt-2 text-gray-600">Manage your tasks and team members</p>
                            </div>

                            {/* Update these buttons */}
                            <div className="mt-4 md:mt-0 flex space-x-3">
                                <motion.button
                                    whileHover={{ 
                                        scale: 1.02,
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowForm(true)}
                                    className="flex items-center px-6 py-2.5 
                                        bg-gradient-to-r from-[#006663] to-[#111111]
                                        text-white rounded-lg transition-all duration-300 
                                        shadow-lg hover:shadow-xl border border-white/10
                                        relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/10 
                                        transform translate-y-full group-hover:translate-y-0 
                                        transition-transform duration-300">
                                    </div>
                                    <FiPlus className="mr-2 relative z-10" />
                                    <span className="relative z-10">New Task</span>
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ 
                                        scale: 1.02,
                                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2)"
                                    }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowRegisterForm(true)}
                                    className="flex items-center px-6 py-2.5
                                        bg-gradient-to-r from-[#111111] to-[#006663]
                                        text-white rounded-lg transition-all duration-300
                                        shadow-lg hover:shadow-xl border border-white/10
                                        relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/10 
                                        transform translate-y-full group-hover:translate-y-0 
                                        transition-transform duration-300">
                                    </div>
                                    <FiUsers className="mr-2 relative z-10" />
                                    <span className="relative z-10">Register User</span>
                                </motion.button>
                            </div>
                        </motion.div>
                        
                        {/* Quick Stats */}
                        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-gradient-to-r from-[#006663] to-[#111111] backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100"
                            >
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <FiClock className="h-6 w-6 text-grey-500" />
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="text-sm font-medium text-white">Active Tasks</h2>
                                        <p className="text-2xl font-semibold text-white">{tasks.length}</p>
                                    </div>
                                </div>
                            </motion.div>
                            {/* Add more stat cards as needed */}
                        </div>
                    </div>

                    {/* Tasks List */}
                    <div className="container mx-auto px-6 pb-8">
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
                                                    {/* Add employee name display */}
                                                    <div className="flex items-center text-gray-600">
                                                        <FiUsers className="mr-2" />
                                                        <span className="font-medium text-[#006663]">
                                                            {task.employeeName || 'Unassigned'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <FiCalendar className="mr-2" />
                                                        <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 mt-2">{task.description}</p>
                                                <div className="flex items-center gap-3 mt-4">
                                                    <span className="px-3 py-1.5 bg-[#006663]/10 text-[#006663] 
                                                                   rounded-full text-sm border border-[#006663]/20">
                                                        {task.clientName}
                                                    </span>
                                                    {/* Add task status */}
                                                    <span className={`px-3 py-1.5 rounded-full text-sm border
                                                        ${task.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                                          task.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                          'bg-green-50 text-green-600 border-green-200'}`}>
                                                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                                    </span>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => deleteTask(task._id)}
                                                className="p-2 hover:bg-red-50 rounded-full 
                                                           group transition-colors duration-200"
                                            >
                                                <FiTrash2 className="h-5 w-5 text-gray-400 
                                                                   group-hover:text-red-500" />
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                    </div>
                </main>

                {/* Modal Form */}
                {showForm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 overflow-y-auto"
                    >
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                            <div className="fixed inset-0 backdrop-blur-sm bg-slate-900/20 transition-opacity"></div>

                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative bg-white rounded-xl w-full max-w-lg p-8 shadow-xl transform transition-all"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Task</h2>
                                
                                {/* Add this error div */}
                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                                        <span className="block sm:inline">{error}</span>
                                    </div>
                                )}

                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">
                                            Task Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={taskData.name}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-4 py-2"
                                        />
                                    </div>
                                    
                                    {/* Replace the Team Assigned input field with this select dropdown */}
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Assign Employee</label>
                                        <select
                                            name="employeeName"
                                            value={taskData.employeeName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                        >
                                            <option value="">Select Employee</option>
                                            {employeesLoading ? (
                                                <option value="" disabled>Loading employees...</option>
                                            ) : employees && employees.length > 0 ? (
                                                employees.map((employee) => (
                                                    <option key={employee._id} value={employee.name}>
                                                        {employee.name}
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No employees available</option>
                                            )}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Client Name</label>
                                        <select
                                            name="clientName"
                                            value={taskData.clientName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                        >
                                            <option value="">Select Client</option>
                                            {clients.map((client) => (
                                                <option key={client._id} value={client.name}>
                                                    {client.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Deadline</label>
                                        <input
                                            type="date"
                                            name="deadline"
                                            value={taskData.deadline}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={taskData.description}
                                            onChange={handleInputChange}
                                            required
                                            rows="3"
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                        ></textarea>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-[#38a3a5] hover:bg-[#22577a] text-white font-semibold px-4 py-2 rounded-md"
                                        >
                                            Create Task
                                        </button>
                                    </div>
                                </form>
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* Registration Modal */}
                {showRegisterForm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 overflow-y-auto"
                    >
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                            <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 transition-opacity"></div>

                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="relative bg-white rounded-xl w-full max-w-md p-8 shadow-xl transform transition-all"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Register New User</h2>
                                <form onSubmit={handleRegisterUser} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Name</label>
                                        <input
                                            type="text"
                                            value={userData.name}
                                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Email</label>
                                        <input
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Password</label>
                                        <input
                                            type="password"
                                            value={userData.password}
                                            onChange={(e) => setUserData({...userData, password: e.target.value})}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1">Role</label>
                                        <select
                                            value={userData.role}
                                            onChange={(e) => setUserData({...userData, role: e.target.value})}
                                            required
                                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#22577a]"
                                        >
                                            <option value="">Select Role</option>
                                            <option value="employee">Employee</option>
                                            <option value="client">Client</option>
                                        </select>
                                    </div>
                                    <div className="flex justify-end space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowRegisterForm(false)}
                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-md"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-[#38a3a5] hover:bg-[#22577a] text-white font-semibold px-4 py-2 rounded-md"
                                        >
                                            Register User
                                        </button>
                                    </div>
                                </form>
                                <div className="absolute top-4 right-4">
                                    <button
                                        onClick={() => setShowRegisterForm(false)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;
