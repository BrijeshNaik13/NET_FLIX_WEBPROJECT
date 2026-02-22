const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'gh7dk9s2@netflix.app.secret';

const authMiddleware = (req, res, next) => {
    // Get token from x-auth-token header or Authorization Bearer token
    let token = req.header('x-auth-token');

    // If no x-auth-token, try Authorization header with Bearer format
    if (!token) {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
