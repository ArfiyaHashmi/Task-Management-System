// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // Assuming your User model is in models/User.js
import dotenv from 'dotenv';

dotenv.config();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user = await User.findOne({ email, role });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// @route   GET /api/auth/user
// @desc    Get user data by token
// @access  Private
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/auth/clients
// @desc    Get all clients
// @access  Private
export const getClients = async (req, res) => {
    try {
        const clients = await User.find({ role: 'client' }).select('name email');
        res.status(200).json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
};

export const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' });
        if (!employees) {
            return res.status(404).json({ msg: 'No employees found' });
        }
        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};