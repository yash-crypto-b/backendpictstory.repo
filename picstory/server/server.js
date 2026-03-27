// Load environment variables FIRST before anything else
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const connectDB = require('./config/connectDB');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// API Routes
app.use('/api/auth', require('./routes/AuthRoutes'));
app.use('/api/posts', require('./routes/PostRoutes'));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'API is running',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Graceful shutdown handler
const gracefulShutdown = () => {
    console.log('\n🛑 Shutting down gracefully...');
    mongoose.connection.close(() => {
        console.log('MongoDB connection closed');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Forced shutdown');
        process.exit(1);
    }, 10000);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start server only after DB connection succeeds
const startServer = async () => {
    try {
        console.log('\n\n╔════════════════════════════════════╗');
        console.log('║   PicStory Backend Starting...      ║');
        console.log('╚════════════════════════════════════╝\n');

        // Step 1: Connect to Database
        const dbConnected = await connectDB();

        if (!dbConnected) {
            console.error('\n❌ Cannot start server without MongoDB connection!');
            console.error('📋 Troubleshooting steps:');
            console.error('   1. Check MongoDB Atlas Network Access settings');
            console.error('   2. Verify MONGO_URI in .env file');
            console.error('   3. Test network connectivity: ping 8.8.8.8');
            console.error('   4. Check cluster is not paused\n');
            process.exit(1);
        }

        // Step 2: Start Express server
        const server = app.listen(PORT, () => {
            console.log('╔════════════════════════════════════╗');
            console.log('║   ✅ SERVER STARTED SUCCESSFULLY   ║');
            console.log('╚════════════════════════════════════╝');
            console.log(`\n🚀 Express server: http://localhost:${PORT}`);
            console.log(`📚 API Routes:`);
            console.log(`   - POST   /api/auth/signup`);
            console.log(`   - POST   /api/auth/login`);
            console.log(`   - GET    /api/auth/me`);
            console.log(`   - GET    /api/posts`);
            console.log(`   - POST   /api/posts`);
            console.log(`\n⏸️  Press CTRL+C to stop\n`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`\n❌ Port ${PORT} is already in use!`);
                console.error('   Try: npx kill-port ' + PORT);
                process.exit(1);
            } else {
                console.error('Server error:', error);
                process.exit(1);
            }
        });
    } catch (error) {
        console.error('\n❌ Fatal error at startup:');
        console.error(error.message);
        process.exit(1);
    }
};

// Start the application
startServer();