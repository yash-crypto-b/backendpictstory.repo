# ====================================================================
# 🚀 MONGODB CONNECTION TROUBLESHOOTING & SETUP GUIDE
# ====================================================================

## ERROR: "ECONNREFUSED _mongodb._tcp.cluster0.nbx4nsi.mongodb.net"

This error means your Node.js application CANNOT reach MongoDB Atlas.
Follow this checklist to identify and fix the issue.

---

## STEP 1: Verify Your .env File

Location: `server/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://PicStory:picstory123@cluster0.nbx4nsi.mongodb.net/picstory
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

⚠️  IMPORTANT:
- Do NOT use spaces around `=` sign
- Do NOT commit .env to git
- Use URL-encoded passwords if they contain special characters
- For password like `my@pass#123`, use: `my%40pass%2523123`

---

## STEP 2: MongoDB Atlas Configuration Checklist

### 2.1 IP Whitelist (Network Access)

1. Go to MongoDB Atlas > Your Project > Network Access
2. Click "Add IP Address"
3. Choose ONE option:
   - Option A: Add Current IP (if you have static IP)
   - Option B: Add 0.0.0.0/0 (temporary for development ONLY, remove in production)
4. Click "Confirm"

⚠️  If you're on WiFi/Mobile Hotspot:
- Your IP changes frequently
- Use 0.0.0.0/0 during development
- In production, use a VPN with static IP or whitelist your server IP

### 2.2 Verify Cluster Status

1. Go to MongoDB Atlas > Databases
2. Check cluster status:
   - ✅ Status should show "Available" (green)
   - ⚠️  If it shows "Paused", click "Resume" to activate
   - ⏳ If it's "Creating", wait for it to complete

### 2.3 Verify Database User

1. Go to MongoDB Atlas > Database Access
2. Find user "PicStory" (from your connection string)
3. Verify:
   - ✅ Password in .env matches MongoDB Atlas
   - ✅ User role is "Atlas Admin" or "Read and write to any database"
   - ✅ User is in ALL clusters (not specific one)

If user doesn't exist:
1. Click "Add a Database User"
2. Username: `PicStory`
3. Password: `picstory123`
4. Built-in Role: `Atlas Admin`
5. Click "Add User"

### 2.4 Get Correct Connection String

1. Click "Connect" button on your cluster
2. Choose "Drivers" tab
3. Select:
   - Driver: Node.js
   - Version: 5.X
4. Copy the connection string
5. Replace values in .env:
   - `<username>` = your database username
   - `<password>` = your database password
   - `<dbname>` = your database name

Example:
```
mongodb+srv://PicStory:picstory123@cluster0.nbx4nsi.mongodb.net/picstory
```

---

## STEP 3: Test Network Connectivity

### 3.1 Test DNS Resolution (Windows Command Prompt)

```bash
nslookup cluster0.nbx4nsi.mongodb.net
```

Expected output:
```
Name:    cluster0.nbx4nsi.mongodb.net
Addresses:  1.2.3.4
            1.2.3.5
            1.2.3.6
```

If it fails:
- Your network cannot reach MongoDB cloud
- Solution: Switch to mobile hotspot or different WiFi

### 3.2 Test Internet Connectivity

```bash
ping 8.8.8.8
```

Expected: Replies from 8.8.8.8
If fails: No internet connection OR firewall blocking

### 3.3 Test MongoDB Connection String

Create file `test-connection.js` in your `server/` folder:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    try {
        console.log('Testing connection...');
        console.log('MONGO_URI:', process.env.MONGO_URI);
        
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000,
        });
        
        console.log('✅ Connection successful!');
        console.log('Host:', conn.connection.host);
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testConnection();
```

Run:
```bash
node test-connection.js
```

---

## STEP 4: Two Connection String Formats

### Option 1: SRV Connection String (Recommended)

```
mongodb+srv://username:password@cluster0.mongodb.net/dbname
```

Pros: Automatic failover, DNS-based discovery
Cons: Requires DNS to work (can fail on some networks)

### Option 2: Direct Connection String (Fallback)

If SRV fails, use direct connection:

```
mongodb://host1.mongodb.net:27017,host2.mongodb.net:27017,host3.mongodb.net:27017/dbname?authSource=admin&replicaSet=atlas-abc&ssl=true
```

How to find:
1. MongoDB Atlas > Connect > Drivers
2. Scroll down to "Advanced Connection String Options"
3. Add `?directConnection=true` to disable DNS lookup

---

## STEP 5: Common Errors & Fixes

### Error: ECONNREFUSED

```
Error: querySrv ECONNREFUSED _mongodb._tcp.cluster0.nbx4nsi.mongodb.net
```

Causes & Fixes:
1. ❌ Cluster paused → ✅ Resume cluster in MongoDB Atlas
2. ❌ IP not whitelisted → ✅ Add IP to Network Access (0.0.0.0/0)
3. ❌ DNS failure → ✅ Test with nslookup, switch to different network
4. ❌ Wrong connection string → ✅ Copy fresh string from MongoDB Atlas

### Error: Authentication Failed

```
Error: MongoServerError: bad auth Authentication failed
```

Causes & Fixes:
1. ❌ Wrong password → ✅ Verify password in MongoDB Atlas
2. ❌ Special chars not encoded → ✅ Use URL encoding: @ = %40, # = %23
3. ❌ User doesn't exist → ✅ Create user in Database Access

### Error: ETIMEDOUT

```
Error: connect ETIMEDOUT
```

Causes & Fixes:
1. ❌ Slow network → ✅ Increase timeout value
2. ❌ Firewall blocking → ✅ Allow outbound HTTPS (port 443)
3. ❌ DNS timeout → ✅ Use Google DNS (8.8.8.8)

### Error: MONGO_URI is not defined

```
Error: MONGO_URI is not defined in environment variables
```

Causes & Fixes:
1. ❌ .env not created → ✅ Create server/.env
2. ❌ dotenv not loaded → ✅ Ensure require('dotenv').config() is FIRST line
3. ❌ Wrong env var name → ✅ Use exactly "MONGO_URI"

---

## STEP 6: Running the Application

### 6.1 First Time Setup

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Create .env file (see STEP 1)
# Add your actual MONGO_URI

# Start development server
npm run dev
```

### 6.2 Expected Output on Success

```
╔════════════════════════════════════╗
║   PicStory Backend Starting...      ║
╚════════════════════════════════════╝

=== MongoDB Connection Diagnostic ===
🔄 Attempting to connect to MongoDB Atlas...
📍 Connection string: cluster0.nbx4nsi.mongodb.net/picstory
✅ MongoDB Connected Successfully!
   Host: cluster0.nbx4nsi.mongodb.net
   Database: picstory
====================================

╔════════════════════════════════════╗
║   ✅ SERVER STARTED SUCCESSFULLY   ║
╚════════════════════════════════════╝

🚀 Express server: http://localhost:5000
📚 API Routes:
   - POST   /api/auth/signup
   - POST   /api/auth/login
   - GET    /api/auth/me
   - GET    /api/posts
   - POST   /api/posts

⏸️  Press CTRL+C to stop
```

### 6.3 Testing the API

```bash
# Test if server is running
curl http://localhost:5000

# Expected response:
# {"message":"API is running","timestamp":"2026-03-26T...","database":"connected"}
```

---

## STEP 7: Advanced Debugging

### 7.1 Enable Mongoose Debug Logs

Add to `server.js` after `require('./config/connectDB')`:

```javascript
mongoose.set('debug', true);
```

This will show all MongoDB queries in console.

### 7.2 Check Node.js Version

```bash
node --version
```

Must be v14 or higher. If lower, upgrade Node.js.

### 7.3 Check if Port is Already in Use

```bash
# Windows
netstat -ano | findstr :5000

# If in use, kill it:
npx kill-port 5000
```

### 7.4 Clear nodemon Cache

```bash
# Windows
del node_modules\.bin\nodemon

# Reinstall
npm install --save-dev nodemon
```

---

## STEP 8: Production Deployment Checklist

- [ ] Remove 0.0.0.0/0 from IP whitelist - add only server IP
- [ ] Change database user password to strong value
- [ ] Set NODE_ENV=production
- [ ] Use environment-specific .env files
- [ ] Enable MongoDB encryption at rest
- [ ] Set up automated backups
- [ ] Monitor connection errors
- [ ] Implement connection pooling with retries

---

## QUICK DIAGNOSIS SCRIPT

Save this as `diagnose.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns').promises;

async function diagnose() {
    console.log('\n📋 PicStory Diagnostics\n');
    
    // Check 1: Environment
    console.log('1️⃣  Environment Variables:');
    console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Missing');
    console.log('   PORT:', process.env.PORT || '5000');
    
    // Check 2: DNS
    console.log('\n2️⃣  DNS Resolution:');
    try {
        const uri = process.env.MONGO_URI;
        const host = uri.split('@')[1].split('/')[0];
        const result = await dns.resolve4(host);
        console.log(`   ${host}: ✅ Resolved to ${result[0]}`);
    } catch (error) {
        console.log('   ❌ DNS Failed:', error.message);
    }
    
    // Check 3: MongoDB Connection
    console.log('\n3️⃣  MongoDB Connection:');
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            connectTimeoutMS: 5000,
            serverSelectionTimeoutMS: 5000,
        });
        console.log('   ✅ Connected Successfully');
        mongoose.connection.close();
    } catch (error) {
        console.log('   ❌ Failed:', error.message);
    }
}

diagnose();
```

Run:
```bash
node diagnose.js
```

---

## SUPPORT RESOURCES

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- Mongoose Docs: https://mongoosejs.com/
- Node.js Docs: https://nodejs.org/docs/

---

Last Updated: March 26, 2026
