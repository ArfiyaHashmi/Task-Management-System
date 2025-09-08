// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const auth = (req, res, next) => {
    // Get token from either Authorization header or x-auth-token
    const bearerHeader = req.header('Authorization');
    const xAuthToken = req.header('x-auth-token');
    
    let token;
    
    if (bearerHeader) {
        // Extract token from "Bearer <token>"
        token = bearerHeader.split(' ')[1];
    } else if (xAuthToken) {
        token = xAuthToken;
    }

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

export default auth;