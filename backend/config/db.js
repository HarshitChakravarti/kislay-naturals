const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Set mongoose options
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    // Encode the password to handle special characters
    const encodedPassword = encodeURIComponent('LsoiS9amw7#');
    
    // Build the connection string with minimal options
    const mongoUri = `mongodb+srv://HarshitChakravarti:${encodedPassword}@kislaynaturals.ztsrn8l.mongodb.net/kislay-naturals?` +
      'retryWrites=true&' +
      'w=majority&' +
      'appName=kislay-naturals';

    logger.info('🔌 Connecting to MongoDB...');
    
    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      // TLS/SSL options
      ssl: true,
      tls: true,
      // Disable certificate validation for development
      tlsInsecure: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
      // Connection pooling
      maxPoolSize: 10,
      minPoolSize: 1,
      // Authentication
      authSource: 'admin',
      authMechanism: 'SCRAM-SHA-1'
    };
    
    // Set up event listeners
    mongoose.connection.on('connecting', () => {
      logger.info('🔌 MongoDB: Connecting...');
    });
    
    mongoose.connection.on('connected', () => {
      logger.info('✅ MongoDB: Connected successfully');
    });
    
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', {
        name: err.name,
        message: err.message,
        code: err.code,
        codeName: err.codeName,
        errorLabels: err.errorLabels,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB: Disconnected');
    });
    
    // Attempt to connect with retry logic
    const maxRetries = 5;
    let retryCount = 0;
    
    const connectWithRetry = async () => {
      try {
        logger.info(`Attempting to connect to MongoDB (attempt ${retryCount + 1}/${maxRetries})...`);
        const conn = await mongoose.connect(mongoUri, options);
        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.underline);
        return conn;
      } catch (error) {
        retryCount++;
        if (retryCount < maxRetries) {
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          logger.warn(`❌ MongoDB connection failed (attempt ${retryCount}/${maxRetries}). Retrying in ${waitTime/1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          return connectWithRetry();
        } else {
          logger.error('❌ Max retries reached. Could not connect to MongoDB:', error);
          throw error;
        }
      }
    };

    const conn = await connectWithRetry();
    
    // Close the Mongoose connection when the Node process ends
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination'.red.bold);
      process.exit(0);
    });

    return conn;
  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;