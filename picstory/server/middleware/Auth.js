const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    try {
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            // Get token
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to request
            req.user = await User.findById(decoded.id).select('-password');

            return next();
        }

        // No token found
        return res.status(401).json({ message: 'Not authorized, no token' });

    } catch (error) {
        return res.status(401).json({
            message: 'Not authorized, token failed',
        });
    }
};

module.exports = { protect };