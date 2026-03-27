# ====================================================================
# 📌 MONGODB ATLAS CONNECTION STRINGS - QUICK REFERENCE
# ====================================================================

## YOUR CURRENT CONNECTION STRING (SRV - Recommended)

MONGO_URI=mongodb+srv://PicStory:picstory123@cluster0.nbx4nsi.mongodb.net/picstory


## ALTERNATIVE: Direct Connection (Use if SRV fails)

# Get this from MongoDB Atlas:
# 1. Cluster > Connect > Drivers
# 2. Scroll to "Advanced Connection String Options"
# 3. Connection String: (copy the full URI)

MONGO_URI=mongodb://cluster0-shard-00-00.nbx4nsi.mongodb.net:27017,cluster0-shard-00-01.nbx4nsi.mongodb.net:27017,cluster0-shard-00-02.nbx4nsi.mongodb.net:27017/picstory?ssl=true&replicaSet=atlas-cluster0&authSource=admin


## URL ENCODING REFERENCE

# If your password contains special characters, URL-encode them:

Character → Encoded
---------    -------
@          → %40
#          → %23
$          → %24
%          → %25
&          → %26
?          → %3F
=          → %3D
:          → %3A
/          → %2F
space      → %20

# Example: password = "my@pass#123"
# Encoded: "my%40pass%2523123"


## FORMAT EXPLANATION

mongodb+srv://USERNAME:PASSWORD@CLUSTER/DATABASE

- USERNAME: Your MongoDB Atlas database user (e.g., PicStory)
- PASSWORD: User password (URL-encoded if special chars)
- CLUSTER: Cluster hostname (e.g., cluster0.nbx4nsi.mongodb.net)
- DATABASE: Database name (e.g., picstory)


## TESTING YOUR CONNECTION STRING

Create test-mongo.js:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
    try {
        console.log('Connecting...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected!');
        console.log('Host:', mongoose.connection.host);
        console.log('DB:', mongoose.connection.name);
        mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
})();
```

Run: node test-mongo.js


## COMMON MISTAKES & FIXES

1. ❌ Spaces in .env
   MONGO_URI = mongodb+srv://... (WRONG - has spaces)
   ✅ MONGO_URI=mongodb+srv://... (CORRECT - no spaces)

2. ❌ Wrong username/password
   Check MongoDB Atlas Database Access section

3. ❌ Special chars not encoded
   If password has @, #, etc., must use %40, %23, etc.

4. ❌ Database doesn't exist
   Create database in MongoDB Atlas first

5. ❌ Cluster is paused
   Resume cluster before connecting

6. ❌ IP not whitelisted
   Add 0.0.0.0/0 to Network Access (or your IP)


## PRODUCTION BEST PRACTICES

✅ Use CONNECTION STRINGS from MongoDB Atlas
✅ Store in .env file (never in code)
✅ Use environment variables
✅ Different .env for dev/staging/production
✅ Rotate passwords regularly
✅ Use strong passwords (16+ chars)
✅ Monitor connection metrics
✅ Set connection timeouts
✅ Implement retry logic
✅ Use connection pooling


## DEBUGGING CHECKLIST

□ Is MongoDB cluster running? (not paused)
□ Is your IP whitelisted?
□ Are credentials correct?
□ Are special chars URL-encoded?
□ Does database exist?
□ Is .env in correct folder (server/)?
□ Is require('dotenv').config() first line?
□ Can you ping 8.8.8.8?
□ Can you nslookup cluster hostname?
□ Is NODE_ENV correct?
□ Are you using correct Mongoose version?
