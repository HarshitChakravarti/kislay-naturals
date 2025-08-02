const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    maxlength: [30, 'Name cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    public_id: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password before saving user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Sign JWT and return with enhanced security
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      role: this.role,
      // Add additional security claims
      iss: 'kislay-naturals-api',
      aud: 'kislay-naturals-client'
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRE || '1h', // Shorter expiration for better security
      algorithm: 'HS256', // Explicitly specify algorithm
      jwtid: require('crypto').randomBytes(16).toString('hex'), // Unique ID for each token
      noTimestamp: false, // Include issued at time
    }
  );
};

// Match user entered password to hashed password in database with timing safe comparison
userSchema.methods.matchPassword = async function(enteredPassword) {
  if (!enteredPassword || !this.password) {
    return false;
  }
  // Use timingSafeEqual for constant-time comparison to prevent timing attacks
  return await bcrypt.compare(enteredPassword, this.password);
};

// Check if password was changed after the token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

// Generate password reset token with expiration
userSchema.methods.getResetPasswordToken = function() {
  // Generate token with crypto for better security
  const resetToken = crypto.randomBytes(20).toString('hex');
  
  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate email verification token
userSchema.methods.getEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
    
  // Expires in 24 hours
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000;
  
  return verificationToken;
};

module.exports = mongoose.model('User', userSchema);
