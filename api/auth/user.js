const jwt = require('jsonwebtoken');
const connectDB = require('../db');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'netflix-app-secret-key-2024';

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDB();

        const token = req.headers['x-auth-token'];

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (err) {
            res.status(401).json({ message: 'Token is not valid' });
        }
    } catch (err) {
        console.error('Get User Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
