const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`Error: ${err.name} - ${err.message}`.red);
  if (err.stack) logger.error(err.stack);
  process.exit(1);
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Close any existing connections first
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }

    // Debug: Log the MongoDB URI (redacted for security)
    const uri = config.mongo.uri;
    const redactedUri = uri.replace(/mongodb(\+srv)?:\/\/([^:]+):([^@]+)@/, 'mongodb$1://$2:****@');
    console.log(`Connecting to MongoDB: ${redactedUri}`);
    console.log(`Environment: ${config.env}`);

    // Set strictQuery to false to prepare for Mongoose 7
    mongoose.set('strictQuery', false);

    // Connect to MongoDB
    const conn = await mongoose.connect(uri, {
      ...config.mongo.options,
      retryWrites: true,
      w: 'majority'
    });
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    return conn;
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`.red);
    // Exit process with failure
    process.exit(1);
  }
};

// Connect to the database
connectDB().then(() => {
  // Start server after DB connection
  const port = process.env.PORT || 5001;
  const server = app.listen(port, () => {
    logger.info(`Server running on port ${port}`.yellow.bold);
  });

  process.on('SIGTERM', () => {
    logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      logger.info('💥 Process terminated!');
      mongoose.connection.close(false, () => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    });
  });
}).catch(err => {
  logger.error(`Failed to connect to MongoDB: ${err.message}`.red);
  process.exit(1);
});