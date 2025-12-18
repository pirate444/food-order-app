# MongoDB Setup Guide - Easy Cloud Solution

Your MERN Stack Food Order App is ready, but needs MongoDB to store data.

## ⭐ Recommended: Use MongoDB Atlas (Free Cloud)

This is the **easiest and fastest** way to get started!

### Step 1: Create Free Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Sign Up"** with email or Google
3. Verify your email

### Step 2: Create a Cluster (2-3 minutes)
1. Click **"Create"** → **"Create Deployment"**
2. Select **"Free"** tier
3. Choose any region (e.g., AWS N. Virginia)
4. Click **"Create Deployment"** and wait

### Step 3: Set Database Credentials
1. In left menu, click **"Database Access"**
2. Click **"Add New Database User"**
3. Enter username and password (save these!)
4. Click **"Add User"**

### Step 4: Allow Network Access
1. Click **"Network Access"**
2. Click **"Add IP Address"**
3. Select **"Allow access from anywhere"** (or add your IP)
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Databases"** and click your cluster
2. Click **"Connect"** button
3. Click **"Drivers"** (Node.js)
4. **Copy the connection string**

Example format:
```
mongodb+srv://fooduser:MyPassword123@cluster0-abc.mongodb.net/food-order-app?retryWrites=true&w=majority
```

### Step 6: Update Your .env File
Edit `/backend/.env` and replace the connection string:

```bash
nano /home/chouayeb/fullstackproject/backend/.env
```

Change this line:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/food-order-app?retryWrites=true&w=majority
```

Replace:
- `username` → your database user
- `password` → your database password  
- `cluster0-abc` → your actual cluster name

### Step 7: Start Backend
```bash
cd /home/chouayeb/fullstackproject/backend
npm run dev
```

✅ You should see: `MongoDB Connected: cluster0-abc.mongodb.net`

---

## Alternative: Use Docker (If you prefer local MongoDB)

If you have Docker installed:

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

Then update `.env`:
```
MONGODB_URI=mongodb://localhost:27017/food-order-app
```

---

## Connection String Issues?

**Special characters in password?**
- URL encode them: @ becomes %40, : becomes %3A, etc.
- Use an [online encoder](https://www.urlencoder.org/)

**"Authentication failed" error?**
- Double-check username and password
- Make sure user is created in "Database Access"

**"Cannot reach server" error?**
- Whitelist your IP in "Network Access"
- Wait 1-2 minutes for cluster to initialize

**"Connection timeout" error?**
- Check your internet connection
- Restart the backend: `npm run dev`

---

## ✅ Next Steps

Once MongoDB is connected:

1. **Restart Backend**:
   ```bash
   npm run dev
   ```

2. **Start Frontend** (new terminal):
   ```bash
   cd /home/chouayeb/fullstackproject/frontend
   npm start
   ```

3. **Visit**: http://localhost:3000

4. **Test**: Register → Browse Food → Add to Cart

---

## Need Help?

- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Connection Troubleshooting](https://docs.atlas.mongodb.com/driver-connection/)

   cd /home/chouayeb/fullstackproject/backend
   npm run dev
   ```

---

## Option 2: Use MongoDB Atlas (Cloud - Easiest Setup)

### Steps:
1. **Create Account**: Go to https://www.mongodb.com/cloud/atlas
2. **Create Free Cluster**: Sign up and create a free M0 cluster
3. **Get Connection String**:
   - Go to "Connect" → "Drivers"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<username>` with your database username

4. **Update .env**:
   ```bash
   cd /home/chouayeb/fullstackproject/backend
   # Edit .env and replace MONGODB_URI with your Atlas connection string
   ```
   Example:
   ```
   MONGODB_URI=mongodb+srv://myusername:mypassword@cluster0.mongodb.net/food-order-app?retryWrites=true&w=majority
   ```

5. **Restart Backend**:
   ```bash
   npm run dev
   ```

---

## Option 3: Use Docker (Alternative)

If you have Docker installed:

```bash
# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# Update .env
MONGODB_URI=mongodb://admin:password@localhost:27017/food-order-app
```

---

## Testing Database Connection

Once MongoDB is running, check if backend reconnects:

```bash
# Check if backend shows connection success
curl http://localhost:5000/api/health

# Expected response if DB connected:
# {"status":"Server is running","database":"..."}
```

---

## Troubleshooting

### "MongoDB connection refused"
- Ensure MongoDB service is running
- Check `MONGODB_URI` in `.env`
- Try restarting the backend

### "Authentication failed"
- Verify username/password in connection string
- Make sure you've enabled network access in MongoDB Atlas

### Port 27017 already in use
```bash
# Find and kill process using port
sudo lsof -i :27017
sudo kill -9 <PID>
```

---

## Next Steps

Once MongoDB is set up:
1. ✅ Backend will automatically connect
2. ✅ You can now:
   - Create user accounts
   - Store food items in database
   - Track orders persistently
   - Manage cart data

**Frontend is ready at**: http://localhost:3000
**Backend is ready at**: http://localhost:5000

Enjoy your Food Order App! 🍕
