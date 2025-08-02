const jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes'
});

// Rate limiter for JWT verification attempts
const jwtVerifyLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60 * 60, // per 1 hour
  blockDuration: 60 * 60, // block for 1 hour if exceeded
});

// Protect routes with enhanced security
exports.protect = async (req, res, next) => {
  let token;
  const ip = req.ip || req.connection.remoteAddress;

  // Check rate limit for JWT verification attempts
  try {
    await jwtVerifyLimiter.consume(ip);
  } catch (rateLimiterRes) {
    return next(new ErrorResponse('Too many requests', 429));
  }

  // Check for token in Authorization header, cookies, or request body
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token with additional security options
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'kislay-naturals-api',
      audience: 'kislay-naturals-client',
      ignoreExpiration: false,
      clockTolerance: 5, // 5 seconds clock skew tolerance
    });

    // Check token expiration manually for additional security
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp <= now) {
      return next(new ErrorResponse('Token has expired', 401));
    }

    // Get user from the token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new ErrorResponse('User not found', 401));
    }

    // Check if user recently changed password
    if (user.changedPasswordAfter(decoded.iat)) {
      return next(new ErrorResponse('User recently changed password. Please log in again.', 401));
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ErrorResponse('Token has expired', 401));
    } else if (err.name === 'JsonWebTokenError') {
      return next(new ErrorResponse('Invalid token', 401));
    }
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
};

// Grant access to specific roles with enhanced security
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Security: Ensure user is authenticated first
    if (!req.user) {
      return next(new ErrorResponse('Authentication required', 401));
    }

    // Check if user role is authorized
    if (!roles.includes(req.user.role)) {
      // Security: Prevent role enumeration by not revealing valid roles
      return next(
        new ErrorResponse('Not authorized to access this route', 403)
      );
    }
    
    // Security: Add security headers for admin routes
    if (req.user.role === 'admin') {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }
    
    next();
  };
};

// Rate limiter for authentication endpoints
exports.authLimiter = authLimiter;

// Security headers middleware
exports.securityHeaders = (req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  next();
};
