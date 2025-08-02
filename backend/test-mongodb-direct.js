const mongoose = require('mongoose');

// Direct connection string (temporary for testing)
const uri = 'mongodb+srv://HarshitChakravarti:LsoiS9amw7%23@kislaynaturals.ztsrn8l.mongodb.net/kislay-naturals?retryWrites=true&w=majority';

console.log('Attempting to connect to MongoDB Atlas...');
console.log('Connection string:', uri.replace(/:[^:]*@/, ':******@')); // Hide password in logs

async function testConnection() {
  try {
    // Attempt to connect with options
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    });

    console.log('✅ MongoDB Atlas connection successful!');
    console.log(`Connected to: ${mongoose.connection.host}`);
    console.log(`Database: ${mongoose.connection.name}`);

    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in database:');
    collections.forEach(c => console.log(`- ${c.name}`));
    
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('Error details:', {
      name: err.name,
      code: err.code,
      codeName: err.codeName,
      errorLabels: err.errorLabels,
    });
    return false;
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\nConnection closed.');
    }
  }
}

// Run the test
testConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
