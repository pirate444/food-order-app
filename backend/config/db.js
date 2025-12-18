const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-order-app';
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    console.log('\n⚠️  MongoDB is not available. Please choose one of the following options:');
    console.log('   1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/');
    console.log('   2. Use MongoDB Atlas (Cloud): https://www.mongodb.com/cloud/atlas');
    console.log('   3. Update MONGODB_URI in .env file with your connection string\n');
    console.log('Attempting to continue with in-memory data (server will restart on errors)...\n');
    // Allow app to continue for demo purposes
  }
};

module.exports = connectDB;
