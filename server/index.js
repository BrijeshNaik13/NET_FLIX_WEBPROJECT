const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

dotenv.config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://BrijeshNaik:Brijesh%40123@cluster0.knoqq2o.mongodb.net/?appName=Cluster0';

// MongoDB Connection Options
const mongoOptions = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
    retryWrites: true,
    retryReads: true
};

// Configure Mongoose buffering with longer timeout
mongoose.set('bufferCommands', true);
mongoose.set('bufferTimeoutMS', 30000);

// Track connection status
let isDbReady = false;

// Connect to MongoDB with better error handling
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI, mongoOptions);
        isDbReady = true;
        console.log('MongoDB Connected successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        isDbReady = false;
        // Retry connection after 5 seconds
        setTimeout(connectDB, 5000);
    }
};

// MongoDB Event Listeners
mongoose.connection.on('connected', () => {
    isDbReady = true;
    console.log('MongoDB connection established');
});

mongoose.connection.on('disconnected', () => {
    isDbReady = false;
    console.log('MongoDB connection lost. Attempting to reconnect...');
    setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB Error:', err.message);
    isDbReady = false;
});

// Start connection
connectDB();

// Middleware to check database connection before processing requests
const checkDbConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database temporarily unavailable. Please try again.'
        });
    }
    next();
};

// Image proxy route to bypass CORS
app.get('/api/proxy-image', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        const contentType = response.headers['content-type'] || 'image/jpeg';
        res.set('Content-Type', contentType);
        res.set('Cache-Control', 'public, max-age=86400');
        res.send(response.data);
    } catch (error) {
        console.error('Proxy Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch image' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const dbState = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    res.json({
        status: 'ok',
        database: dbState[mongoose.connection.readyState] || 'unknown',
        timestamp: new Date().toISOString()
    });
});

// Routes - Auth routes
app.use('/api/auth', authRoutes);

// Default route - serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

// For Vercel - serve static files from client/dist
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

// Export for Vercel serverless
module.exports = app;
