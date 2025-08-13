import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: {
    public_id: string;
    url: string;
  };
  role: 'user' | 'admin';
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    maxlength: [30, 'Name cannot exceed 30 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
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
    default: 'user',
    enum: ['user', 'admin']
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: Record<string, any>) {
      if (ret.password) {
        delete ret.password;
      }
      return ret;
    }
  }
});


// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with salt rounds of 12
    const salt = await bcrypt.genSalt(12);
    const user = this as unknown as IUser & { password: string };
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: unknown) {
    next(error instanceof Error ? error : new Error('Failed to hash password'));
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    const user = this as unknown as IUser & { password: string };
    return await bcrypt.compare(candidatePassword, user.password);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Password comparison failed';
    throw new Error(`Password comparison failed: ${errorMessage}`);
  }
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function(): string {
  // Generate token
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


// Prevent duplicate model initialization
export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User; 