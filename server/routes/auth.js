const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'gh7dk9s2@netflix.app.secret';

// Register User
router.post('/register', async (req, res) => {
    console.log('Register request received:', req.body.email);
    try {
        const { username, email, password, name } = req.body;

        // Use name as username if username is not provided
        const userName = username || name || email.split('@')[0];
        console.log('Looking for existing user with email:', email);

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        user = await User.findOne({ username: userName });
        if (user) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        console.log('Creating new user:', userName);
        // Create new user
        user = new User({ username: userName, email, password });
        await user.save();
        console.log('User created successfully:', user._id);

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Register Error:', err);
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get current user
router.get('/user', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get User Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add movie to my list
router.post('/myList/add', authMiddleware, async (req, res) => {
    try {
        const { imdbID, Title, Year, Type, Poster } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if movie already in list
        const movieExists = user.myList.find(m => m.imdbID === imdbID);
        if (movieExists) {
            return res.status(400).json({ message: 'Movie already in your list' });
        }

        // Add movie to list
        user.myList.push({ imdbID, Title, Year, Type, Poster });
        await user.save();

        res.json({ message: 'Movie added to list', myList: user.myList });
    } catch (err) {
        console.error('Add to List Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove movie from my list
router.post('/myList/remove', authMiddleware, async (req, res) => {
    try {
        const { imdbID } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove movie from list
        user.myList = user.myList.filter(m => m.imdbID !== imdbID);
        await user.save();

        res.json({ message: 'Movie removed from list', myList: user.myList });
    } catch (err) {
        console.error('Remove from List Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get my list
router.get('/myList', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ myList: user.myList });
    } catch (err) {
        console.error('Get My List Error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
