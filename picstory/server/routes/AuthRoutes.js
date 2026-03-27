const express = require('express');
const router = express.Router();

// Controllers
const { signup, login, getMe } = require('../controller/AuthControllers');

// Middleware
const { protect } = require('../middleware/Auth');

// Routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;