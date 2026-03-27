const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error(
                '❌ MONGO_URI is not defined!\n' +
                '   Add MONGO_URI to your .env file.\n' +
                '   Format: mongodb+srv://username:password@cluster.mongodb.net/dbname'
            );
        }

        console.log('\n=== MongoDB Connection Diagnostic ===');
        console.log('🔄 Attempting to connect to MongoDB Atlas...');
        console.log(`📍 Connection string: ${mongoURI.split('@')[1] || 'hidden'}`);

        // Modern Mongoose 8 - no deprecated options needed
        const connection = await mongoose.connect(mongoURI, {
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            serverSelectionTimeoutMS: 10000,
            retryWrites: true,
            w: 'majority',
        });

        const dbHost = connection.connection.host;
        const dbName = connection.connection.name;

        console.log(`✅ MongoDB Connected Successfully!`);
        console.log(`   Host: ${dbHost}`);
        console.log(`   Database: ${dbName}`);
        console.log('====================================\n');

        return true;
    } catch (error) {
        console.error('\n❌ MONGODB CONNECTION FAILED');
        console.error('====================================');

        // Detailed error diagnostics
        if (error.message.includes('ECONNREFUSED')) {
            console.error('🔴 Error: ECONNREFUSED');
            console.error('   Possible causes:');
            console.error('   1. MongoDB Atlas cluster is PAUSED');
            console.error('   2. Your IP is NOT whitelisted in MongoDB Atlas');
            console.error('   3. Network connectivity issue (DNS failure)');
            console.error('   4. Incorrect connection string format');
            console.error('\n   🔧 FIX:');
            console.error('   - Go to MongoDB Atlas > Network Access');
            console.error('   - Add 0.0.0.0/0 to whitelist OR your specific IP');
            console.error('   - Check if cluster is running (not paused)');
            console.error('   - Test: nslookup cluster0.nbx4nsi.mongodb.net');
        } else if (error.message.includes('authentication failed')) {
            console.error('🔴 Error: Authentication Failed');
            console.error('   Possible causes:');
            console.error('   1. Wrong username or password');
            console.error('   2. Special characters not URL-encoded');
            console.error('   3. Database user does not exist');
            console.error('\n   🔧 FIX:');
            console.error('   - Verify credentials in MongoDB Atlas');
            console.error('   - Check password for special chars: @ # $ % etc');
            console.error('   - URL-encode special chars: @ = %40, # = %23');
        } else if (error.message.includes('ETIMEDOUT')) {
            console.error('🔴 Error: Connection Timeout');
            console.error('   Possible causes:');
            console.error('   1. Network is too slow or unreliable');
            console.error('   2. Firewall blocking port 27017/srv');
            console.error('   3. DNS lookup taking too long');
            console.error('\n   🔧 FIX:');
            console.error('   - Test: ping 8.8.8.8 (Google DNS)');
            console.error('   - Try switching to mobile hotspot for testing');
            console.error('   - Use direct connection string instead of SRV');
        } else if (error.message.includes('querySrv')) {
            console.error('🔴 Error: SRV Resolution Failed');
            console.error('   Possible causes:');
            console.error('   1. DNS resolution failure');
            console.error('   2. Invalid cluster name in connection string');
            console.error('\n   🔧 FIX:');
            console.error('   - Verify cluster name matches MongoDB Atlas');
            console.error('   - Test DNS: nslookup _mongodb._tcp.cluster0.nbx4nsi.mongodb.net');
            console.error('   - Use direct connection as fallback');
        }

        console.error(`\n📋 Full Error: ${error.message}`);
        console.error('====================================\n');

        return false;
    }
};

module.exports = connectDB;