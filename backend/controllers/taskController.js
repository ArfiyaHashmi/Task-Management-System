import Task from '../models/taskModel.js';

export const createTask = async (req, res) => {
    try {
        console.log('Received task data:', req.body);
        
        const { 
            name, 
            employeeName, 
            employeeId, 
            clientName, 
            clientId, 
            deadline, 
            description, 
            status 
        } = req.body;

        // Validate required fields
        if (!name || !employeeName || !employeeId || !clientName || !clientId || !deadline || !description) {
            return res.status(400).json({ 
                message: 'Missing required fields',
                received: { name, employeeName, employeeId, clientName, clientId, deadline, description }
            });
        }

        const task = new Task({
            name,
            employeeName,
            employeeId,
            clientName,
            clientId,
            deadline: new Date(deadline),
            description,
            status: status || 'pending'
        });

        const savedTask = await task.save();
        console.log('Task saved successfully:', savedTask);
        res.status(201).json(savedTask);

    } catch (error) {
        console.error('Task creation error:', error);
        res.status(500).json({ 
            message: 'Server error while creating task',
            error: error.message 
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getClientTasks = async (req, res) => {
    try {
        const userId = req.user.id; // From auth middleware
        const tasks = await Task.find({ clientId: userId })
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};