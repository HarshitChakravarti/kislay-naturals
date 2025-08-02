// config/config.js
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    expiresIn: process.env.JWT_EXPIRE || '30d',
    cookieExpires: parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 30
  },
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kislay-naturals',
    options: {
      // These options are no longer needed in MongoDB Node.js Driver v4.0.0 and later
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s for local dev
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    }
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

// Validate required config
if (!config.mongo.uri) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

if (!config.jwt.secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

module.exports = config;