const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const colors = require('colors');

// Load config
const config = require('./config/config');

// Initialize express
const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Import middleware
const { securityHeaders } = require('./middleware/auth');
const errorHandler = require('./middleware/error');

// Security middleware
app.use(helmet());
app.use(securityHeaders);

// Enable CORS
app.use(cors({
  origin: config.env === 'production' 
    ? config.clientUrl 
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-RateLimit-Reset', 'X-RateLimit-Remaining', 'X-RateLimit-Limit']
}));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'price',
      'ratingsAverage',
      'ratingsQuantity',
      'category',
      'stock'
    ]
  })
);

// Compress all responses
app.use(compression());

// Rate limiting
app.use(rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max
}));

// Dev logging middleware
if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Database connection is now handled in config/db.js

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// Serve static assets in production
if (config.env === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.json({
      status: 'success',
      message: 'Kislay Naturals API is running...',
      environment: config.env,
      version: require('../package.json').version,
      timestamp: new Date().toISOString()
    });
  });
}

// Error handling middleware
app.use(errorHandler);

// Use port from environment variable or default to 5050
const PORT = process.env.PORT || 5050;

const server = app.listen(
  PORT,
  '0.0.0.0',
  console.log(`Server running in ${config.env} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});

module.exports = app;
