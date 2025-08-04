# Complete Authentication System for Kislay Naturals

This document describes the complete authentication system implemented for the Kislay Naturals Next.js application.

## 🏗️ Architecture Overview

The authentication system is built with the following components:

- **Mongoose User Model** - Database schema with validation
- **API Routes** - RESTful endpoints for auth operations
- **Middleware** - Rate limiting, CSRF protection, and auth verification
- **Client Components** - React forms with validation
- **Context Provider** - Global auth state management
- **JWT Utilities** - Token generation and verification

## 📁 File Structure

```
src/
├── lib/
│   ├── models/
│   │   └── User.ts                 # Mongoose User model
│   ├── middleware/
│   │   ├── auth.ts                 # Authentication middleware
│   │   ├── rateLimit.ts            # Rate limiting
│   │   └── csrf.ts                 # CSRF protection
│   ├── mongoose.ts                 # Database connection
│   ├── jwt.ts                      # JWT utilities
│   └── utils.ts                    # Utility functions
├── app/api/auth/
│   ├── signup/
│   │   └── route.ts                # User registration
│   ├── login/
│   │   └── route.ts                # User login
│   ├── logout/
│   │   └── route.ts                # User logout
│   └── me/
│       └── route.ts                # Get current user
├── components/auth/
│   ├── SignupForm.tsx              # Registration form
│   └── LoginForm.tsx               # Login form
├── contexts/
│   └── AuthContext.tsx             # Global auth state
└── types/
    └── index.ts                    # TypeScript interfaces
```

## 🔐 Security Features

### 1. Password Security
- **Hashing**: bcrypt with 12 salt rounds
- **Validation**: Minimum 8 characters, mixed case, numbers
- **Storage**: Never stored in plain text

### 2. Rate Limiting
- **Login/Signup**: 5 requests per 15 minutes per IP
- **Protection**: Prevents brute force attacks
- **Headers**: Retry-After for client guidance

### 3. CSRF Protection
- **Token Generation**: Unique tokens per session
- **Validation**: Server-side token verification
- **Expiration**: 24-hour token lifetime

### 4. JWT Security
- **Issuer/Audience**: Specific to application
- **Expiration**: 7-day token lifetime
- **Verification**: Server-side validation

### 5. Cookie Security
- **HttpOnly**: Prevents XSS attacks
- **Secure**: HTTPS only in production
- **SameSite**: Lax for CSRF protection

## 🗄️ Database Schema

### User Model
```typescript
{
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- `email: 1` - For fast email lookups
- `username: 1` - For fast username lookups

## 🚀 API Endpoints

### POST /api/auth/signup
**Purpose**: Register new user

**Request Body**:
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "csrfToken": "generated-token"
}
```

**Response**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "user-id",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes**:
- `201` - User created successfully
- `400` - Validation errors
- `409` - Username/email already exists
- `429` - Rate limit exceeded
- `403` - Invalid CSRF token

### POST /api/auth/login
**Purpose**: Authenticate user

**Request Body**:
```json
{
  "emailOrUsername": "john@example.com",
  "password": "SecurePass123",
  "csrfToken": "generated-token"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "user-id",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes**:
- `200` - Login successful
- `400` - Missing credentials
- `401` - Invalid credentials
- `429` - Rate limit exceeded
- `403` - Invalid CSRF token

### GET /api/auth/me
**Purpose**: Get current user data

**Headers**: Requires authentication cookie

**Response**:
```json
{
  "success": true,
  "user": {
    "_id": "user-id",
    "username": "johndoe",
    "email": "john@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes**:
- `200` - User data retrieved
- `401` - Not authenticated
- `404` - User not found

### POST /api/auth/logout
**Purpose**: Logout user

**Response**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## 🎨 Client Components

### SignupForm
- **Validation**: Real-time form validation
- **CSRF**: Automatic token generation
- **Security**: Password strength requirements
- **UX**: Loading states and error handling

### LoginForm
- **Flexibility**: Email or username login
- **Security**: CSRF protection
- **UX**: Password visibility toggle
- **Error Handling**: Comprehensive error messages

### AuthContext
- **State Management**: Global auth state
- **Persistence**: localStorage for hydration
- **Auto-refresh**: Periodic session validation
- **Navigation**: Automatic redirects

## 🔧 Configuration

### Environment Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

### MongoDB Atlas Setup
1. Create MongoDB Atlas cluster
2. Configure network access (IP whitelist)
3. Create database user with read/write permissions
4. Get connection string and add to environment variables

## 🚀 Usage Examples

### Protected Route Component
```typescript
import { requireAuth } from '@/lib/middleware/auth';

export const GET = requireAuth(async (request) => {
  const user = request.user;
  return NextResponse.json({ message: `Hello ${user.username}!` });
});
```

### Client-side Auth Check
```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, isLoading, logout } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please log in</div>;
  
  return (
    <div>
      <h1>Welcome {user.username}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Form Submission with CSRF
```typescript
const handleSubmit = async (formData) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-session-id': 'unique-session-id',
    },
    body: JSON.stringify({
      ...formData,
      csrfToken: csrfToken,
    }),
  });
};
```

## 🛡️ Security Best Practices

1. **Input Validation**: Server-side validation for all inputs
2. **Password Requirements**: Strong password policy enforcement
3. **Rate Limiting**: Protection against brute force attacks
4. **CSRF Protection**: Prevention of cross-site request forgery
5. **Secure Cookies**: HttpOnly, Secure, SameSite attributes
6. **JWT Security**: Proper token validation and expiration
7. **Error Handling**: Generic error messages to prevent information leakage
8. **Logging**: Comprehensive error logging for debugging

## 🧪 Testing

### API Testing
```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"TestPass123","csrfToken":"token"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"test@example.com","password":"TestPass123","csrfToken":"token"}'

# Test protected route
curl -X GET http://localhost:3000/api/auth/me \
  -H "Cookie: auth_token=your-jwt-token"
```

## 🔄 Migration from Existing System

The new authentication system is designed to be backward compatible. To migrate:

1. **Database**: The new User model will work alongside existing users
2. **API**: New endpoints are separate from existing ones
3. **Client**: Gradually migrate components to use new forms
4. **Testing**: Test thoroughly in staging environment

## 📝 Future Enhancements

1. **Email Verification**: Add email verification flow
2. **Password Reset**: Implement forgot password functionality
3. **OAuth Integration**: Add Google, Facebook login
4. **Two-Factor Authentication**: SMS or TOTP-based 2FA
5. **Session Management**: Multiple device session handling
6. **Audit Logging**: Track authentication events
7. **Account Lockout**: Temporary account suspension after failed attempts

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection**: Check connection string and network access
2. **JWT Errors**: Verify JWT_SECRET environment variable
3. **CSRF Token**: Ensure proper session ID headers
4. **Rate Limiting**: Check IP address detection
5. **Cookie Issues**: Verify domain and HTTPS settings

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` and check console for detailed error messages.

## 📄 License

This authentication system is part of the Kislay Naturals application and follows security best practices for production use. 