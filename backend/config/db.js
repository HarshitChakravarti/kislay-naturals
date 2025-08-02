const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://HarshitChakravarti:LsoiS9amw7#@kislaynaturals.ztsrn8l.mongodb.net/?retryWrites=true&w=majority&appName=KislayNaturals', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
    
    // Connection events
    mongoose.connection.on('connected', () => {
      logger.info('Mongoose connected to DB'.green.bold);
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`Mongoose connection error: ${err.message}`.red.bold);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected'.yellow.bold);
    });

    // Close the Mongoose connection when the Node process ends
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('Mongoose connection closed through app termination'.red.bold);
      process.exit(0);
    });

  } catch (error) {
    logger.error(`Error: ${error.message}`.red.bold);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
