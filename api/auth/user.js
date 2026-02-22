const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://BrijeshNaik:Brijesh%40123@cluster0.knoqq2o.mongodb.net/?appName=Cluster0';

const JWT_SECRET = process.env.JWT_SECRET || 'gh7dk9s2@netflix.app.secret';

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    myList: { type: Array, default: [] }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(MONGODB_URI);
    }
}

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDB();

        // Get token from header
        const token = req.headers['x-auth-token'] || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error('Get User Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
