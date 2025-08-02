const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' }); // Explicitly load .env file

// Connection URI from .env - ensure it's properly formatted
const uri = process.env.MONGODB_URI;

// Debug: Log the environment variables with more details
console.log('Environment variables loaded:');
console.log('- NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('- MONGODB_URI length:', uri ? uri.length : 'undefined');

// Show first 20 chars of the URI for debugging (without exposing credentials)
if (uri) {
  const safeUri = uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)/, (match, p1, p2) => 
    `${p1}${'*'.repeat(p2.length)}`
  );
  console.log('- MONGODB_URI starts with:', safeUri.substring(0, 50) + (safeUri.length > 50 ? '...' : ''));
}

if (!uri) {
  console.error('❌ Error: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// Ensure the URI starts with the correct protocol
if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
  console.error('❌ Error: Invalid MongoDB connection string format');
  console.error('Connection string must start with mongodb:// or mongodb+srv://');
  console.error('First 20 chars of the string:', JSON.stringify(uri.substring(0, 20)));
  console.error('Check for hidden characters or encoding issues in your .env file');
  process.exit(1);
}

// Test connection
async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    
    // Attempt to connect with options
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log('✅ MongoDB Atlas connection successful!');
    console.log(`Connected to: ${mongoose.connection.host}`);

    // Get database name from connection string
    const dbName = mongoose.connection.name;
    console.log(`Database: ${dbName}`);

    // List collections in the current database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('Error details:', {
      name: err.name,
      code: err.code,
      codeName: err.codeName,
      reason: err.reason,
    });
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) { // 1 = connected
      await mongoose.disconnect();
      console.log('\nConnection closed.');
    }
    process.exit(0);
  }
}

// Handle promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Run the test
testConnection();