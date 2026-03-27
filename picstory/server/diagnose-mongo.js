/**
 * MongoDB Connection Diagnostic Script
 * 
 * Purpose: Identify exactly where your MongoDB connection is failing
 * Usage: node diagnose-mongo.js
 * 
 * This script tests:
 * 1. Environment variable loading
 * 2. DNS resolution
 * 3. Network connectivity
 * 4. MongoDB authentication
 * 5. Database access
 */

require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns').promises;
const net = require('net');

const MONGO_URI = process.env.MONGO_URI;
const COLORS = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    bold: '\x1b[1m'
};

function log(color, icon, message) {
    console.log(`${color}${icon} ${message}${COLORS.reset}`);
}

function parseMongoURI(uri) {
    try {
        const url = new URL(uri.replace('mongodb+srv://', 'http://'));
        return {
            username: url.username,
            password: url.password ? '***' : 'NONE',
            host: url.hostname,
            port: url.port || '27017',
            database: url.pathname.split('/')[1] || 'admin'
        };
    } catch (error) {
        return null;
    }
}

async function testDNS(host) {
    try {
        const addresses = await dns.resolve4(host);
        log(COLORS.green, '✅', `DNS: ${host} resolved to ${addresses[0]}`);
        return true;
    } catch (error) {
        log(COLORS.red, '❌', `DNS: Failed to resolve ${host}`);
        log(COLORS.yellow, '💡', `Error: ${error.message}`);
        return false;
    }
}

async function testNetworkConnectivity() {
    return new Promise((resolve) => {
        const socket = net.createConnection({ host: '8.8.8.8', port: 53, timeout: 3000 });
        socket.on('connect', () => {
            log(COLORS.green, '✅', 'Network: Internet connectivity OK');
            socket.destroy();
            resolve(true);
        });
        socket.on('error', () => {
            log(COLORS.red, '❌', 'Network: No internet connectivity');
            resolve(false);
        });
    });
}

async function testMongoConnection() {
    try {
        log(COLORS.blue, '🔄', 'Mongoose: Attempting connection...');
        
        const connection = await mongoose.connect(MONGO_URI, {
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });

        log(COLORS.green, '✅', 'Mongoose: Connection successful');
        log(COLORS.green, '✅', `Host: ${connection.connection.host}`);
        log(COLORS.green, '✅', `Database: ${connection.connection.name}`);
        
        // Test database access
        try {
            const result = await connection.connection.db.admin().ping();
            log(COLORS.green, '✅', 'Database: Ping successful');
        } catch (pingError) {
            log(COLORS.yellow, '⚠️ ', `Database: Ping failed - ${pingError.message}`);
        }

        mongoose.connection.close();
        return true;
    } catch (error) {
        log(COLORS.red, '❌', `Mongoose: Connection failed`);
        log(COLORS.red, '📋', `Error: ${error.message}`);
        
        // Provide specific guidance
        if (error.message.includes('ECONNREFUSED')) {
            log(COLORS.yellow, '💡', 'Possible cause: Cluster paused or IP not whitelisted');
        } else if (error.message.includes('authentication failed')) {
            log(COLORS.yellow, '💡', 'Possible cause: Wrong username or password');
        } else if (error.message.includes('ETIMEDOUT')) {
            log(COLORS.yellow, '💡', 'Possible cause: Network timeout or DNS issue');
        } else if (error.message.includes('querySrv')) {
            log(COLORS.yellow, '💡', 'Possible cause: DNS SRV lookup failure');
        }
        
        return false;
    }
}

async function runDiagnostics() {
    console.log(`\n${COLORS.bold}${COLORS.blue}╔════════════════════════════════════╗${COLORS.reset}`);
    console.log(`${COLORS.bold}${COLORS.blue}║  MONGODB CONNECTION DIAGNOSTICS    ║${COLORS.reset}`);
    console.log(`${COLORS.bold}${COLORS.blue}╚════════════════════════════════════╝${COLORS.reset}\n`);

    // Test 1: Check environment
    console.log(`${COLORS.bold}Step 1: Environment Variables${COLORS.reset}`);
    if (!MONGO_URI) {
        log(COLORS.red, '❌', 'MONGO_URI not found in .env');
        log(COLORS.yellow, '💡', 'Create server/.env with MONGO_URI=mongodb+srv://...');
        return;
    }
    log(COLORS.green, '✅', 'MONGO_URI found');

    const parsed = parseMongoURI(MONGO_URI);
    if (!parsed) {
        log(COLORS.red, '❌', 'Invalid MONGO_URI format');
        return;
    }
    log(COLORS.green, '✅', `Username: ${parsed.username}`);
    log(COLORS.green, '✅', `Host: ${parsed.host}`);
    log(COLORS.green, '✅', `Database: ${parsed.database}`);

    // Test 2: DNS
    console.log(`\n${COLORS.bold}Step 2: DNS Resolution${COLORS.reset}`);
    const dnsOK = await testDNS(parsed.host);

    // Test 3: Network
    console.log(`\n${COLORS.bold}Step 3: Network Connectivity${COLORS.reset}`);
    const networkOK = await testNetworkConnectivity();

    // Test 4: MongoDB Connection
    console.log(`\n${COLORS.bold}Step 4: MongoDB Connection${COLORS.reset}`);
    const mongoOK = await testMongoConnection();

    // Summary
    console.log(`\n${COLORS.bold}${COLORS.blue}════════════════════════════════════${COLORS.reset}`);
    console.log(`${COLORS.bold}Summary:${COLORS.reset}`);
    log(dnsOK ? COLORS.green : COLORS.red, dnsOK ? '✅' : '❌', `DNS Resolution: ${dnsOK ? 'OK' : 'FAILED'}`);
    log(networkOK ? COLORS.green : COLORS.red, networkOK ? '✅' : '❌', `Network: ${networkOK ? 'OK' : 'FAILED'}`);
    log(mongoOK ? COLORS.green : COLORS.red, mongoOK ? '✅' : '❌', `MongoDB Connection: ${mongoOK ? 'OK' : 'FAILED'}`);

    if (mongoOK) {
        console.log(`\n${COLORS.green}${COLORS.bold}🎉 All tests passed! Your MongoDB connection is working.${COLORS.reset}\n`);
        console.log('Next steps:');
        console.log('1. Run: npm run dev');
        console.log('2. Visit: http://localhost:5000');
        console.log('3. Check response in console\n');
    } else {
        console.log(`\n${COLORS.red}${COLORS.bold}⚠️  Some tests failed. See above for details.${COLORS.reset}\n`);
        console.log('Troubleshooting:');
        console.log('1. Check MongoDB Atlas Network Access (whitelist your IP)');
        console.log('2. Verify cluster is running (not paused)');
        console.log('3. Confirm username and password are correct');
        console.log('4. Try switching to different network (WiFi/mobile)');
        console.log('5. Check if DNS is working: nslookup cluster0.nbx4nsi.mongodb.net\n');
    }

    console.log(`${COLORS.blue}More help: Read MONGODB_SETUP_GUIDE.md${COLORS.reset}\n`);
}

runDiagnostics().catch(error => {
    console.error('Diagnostic error:', error);
    process.exit(1);
});