// routes/authRoutes.js
import express from 'express';
const router = express.Router();
import { registerUser, loginUser, getUser, getClients, getEmployees } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { check} from 'express-validator';

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('role', 'Role is required').isIn(['manager', 'employee', 'client']),
  ],
  registerUser
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
    check('role', 'Role is required').isIn(['manager', 'employee', 'client'])
  ],
  loginUser
);

router.get('/user', authMiddleware, getUser);

router.get('/clients', getClients);

router.get('/employees', authMiddleware, getEmployees);

export default router;