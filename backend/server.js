const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./utils/logger');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`Error: ${err.name} - ${err.message}`.red);
  process.exit(1);
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Close any existing connections first
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }

    // Set up event listeners
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully'.cyan.underline);
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`MongoDB connection error: ${err.message}`.red);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected'.yellow);
    });

    // Connect to MongoDB
    const conn = await mongoose.connect(
      config.mongo.uri, 
      config.mongo.options
    );
    
    logger.info(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    return conn;
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`.red);
    // Exit process with failure
    process.exit(1);
  }
};

// Connect to the database
connectDB().catch(err => {
  logger.error(`Failed to connect to MongoDB: ${err.message}`.red);
  process.exit(1);
});

// The server is started in app.js
// This file now only handles the database connection and uncaught exceptions
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    logger.info('💥 Process terminated!');
  });
});