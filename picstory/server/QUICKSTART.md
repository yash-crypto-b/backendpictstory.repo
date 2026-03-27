═══════════════════════════════════════════════════════════════════════════
                        🚀 QUICK START GUIDE 🚀
═══════════════════════════════════════════════════════════════════════════

⏱️  Time to get running: 5 minutes

═══════════════════════════════════════════════════════════════════════════


## 📋 PRE-REQUISITES

✅ Node.js v14+ installed (check: node --version)
✅ npm installed (check: npm --version)
✅ MongoDB Atlas account (free tier at mongodb.com/cloud/atlas)


## 🎯 5-MINUTE SETUP

### 1️⃣ MongoDB Atlas Configuration (2 minutes)

Go to: https://www.mongodb.com/cloud/atlas

1. Login or create account
2. Create cluster (free tier available)
3. Wait for cluster to be ready (usually 5-10 minutes)
4. Go to "Network Access" tab
5. Click "Add IP Address"
6. Select "Allow access from anywhere" (0.0.0.0/0)
7. Go to "Database Access" tab
8. Create user:
   - Username: PicStory
   - Password: picstory123
   - Click "Add User"
9. Click "Connect" on your cluster
10. Copy the connection string (the long mongodb+srv://... URL)


### 2️⃣ Update .env File (1 minute)

File: server/.env

```env
PORT=5000
MONGO_URI=<PASTE_YOUR_CONNECTION_STRING_HERE>
JWT_SECRET=10e3a4e4714ddfb7d3e33c799ac661166bb105bcbc3d68d325ba8416a0a81eb9
CLOUDINARY_CLOUD_NAME=dpqaxszvo
CLOUDINARY_API_KEY=243173766948918
CLOUDINARY_API_SECRET=kjQzLaxwAavTGOfhRc6lTvz_Elc
```

Replace:
- `<PASTE_YOUR_CONNECTION_STRING_HERE>` with your MongoDB URI
- Keep it in format: mongodb+srv://PicStory:picstory123@cluster0...


### 3️⃣ Install & Run (2 minutes)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Start development server
npm run dev
```


## ✅ SUCCESS INDICATORS

You should see output like:

```
╔════════════════════════════════════╗
║   PicStory Backend Starting...      ║
╚════════════════════════════════════╝

=== MongoDB Connection Diagnostic ===
🔄 Attempting to connect to MongoDB Atlas...
✅ MongoDB Connected Successfully!
   Host: cluster0.nbx4nsi.mongodb.net
   Database: picstory

╔════════════════════════════════════╗
║   ✅ SERVER STARTED SUCCESSFULLY   ║
╚════════════════════════════════════╝

🚀 Express server: http://localhost:5000
⏸️  Press CTRL+C to stop
```

Test it:
```bash
curl http://localhost:5000
```

Should return:
```json
{
  "message": "API is running",
  "timestamp": "2026-03-26T...",
  "database": "connected"
}
```


## ⚠️ IF IT FAILS

### Error: ECONNREFUSED

```bash
# Test your setup
node diagnose-mongo.js
```

Likely fixes:
1. Check cluster is running (not paused) in MongoDB Atlas
2. Verify IP is whitelisted (Network Access > 0.0.0.0/0)
3. Test DNS: nslookup cluster0.nbx4nsi.mongodb.net
4. Try different network (WiFi to mobile hotspot)


### Error: Port 5000 in use

```bash
npx kill-port 5000
npm run dev
```


### Error: Module not found

```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```


## 📚 DETAILED GUIDES

- COMPLETE_FIX_SUMMARY.md     - Full explanation of all fixes
- MONGODB_SETUP_GUIDE.md      - Comprehensive troubleshooting
- CONNECTION_STRINGS.md       - Connection string reference


## 🔧 COMMON COMMANDS

```bash
# Start dev server with auto-reload
npm run dev

# Start production server
npm start

# Test MongoDB connection
node diagnose-mongo.js

# Check if port is in use
netstat -ano | findstr :5000

# Kill process on port 5000
npx kill-port 5000

# Reinstall dependencies
npm install

# Check Node version
node --version

# Check MongoDB connection
npm run dev
```


## 📝 .env EXAMPLE

```env
# Server Configuration
PORT=5000

# MongoDB Configuration (REQUIRED)
MONGO_URI=mongodb+srv://PicStory:picstory123@cluster0.nbx4nsi.mongodb.net/picstory

# JWT Secret (REQUIRED)
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary (REQUIRED)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```


## 🎯 NEXT STEPS

1. ✅ Get MongoDB running (this guide)
2. Build your API endpoints
3. Create React frontend
4. Deploy to production

Congratulations! Your backend is ready! 🎉


═══════════════════════════════════════════════════════════════════════════
Last Updated: March 26, 2026
Support: Read COMPLETE_FIX_SUMMARY.md for detailed troubleshooting
═══════════════════════════════════════════════════════════════════════════
