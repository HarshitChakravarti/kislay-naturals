# Authentication System Setup Guide

## Prerequisites

1. Node.js 18+ installed
2. MongoDB Atlas account
3. Next.js project with TypeScript

## Installation Steps

### 1. Install Dependencies

The following dependencies are already included in your `package.json`:

```bash
npm install
```

Required dependencies:
- `mongoose` - MongoDB ODM
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `@types/bcryptjs` - TypeScript types
- `@types/jsonwebtoken` - TypeScript types

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# Environment
NODE_ENV=development
```

### 3. MongoDB Atlas Setup

1. **Create Cluster**:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster (free tier works)
   - Choose your preferred cloud provider and region

2. **Configure Network Access**:
   - Go to Network Access
   - Add your IP address or `0.0.0.0/0` for development
   - For production, whitelist your server IP

3. **Create Database User**:
   - Go to Database Access
   - Create a new user with read/write permissions
   - Save username and password

4. **Get Connection String**:
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>`, `<password>`, and `<dbname>` with your values

### 4. Generate JWT Secret

Generate a secure JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

### 5. Test the Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the signup endpoint**:
   ```bash
   curl -X GET http://localhost:3000/api/auth/signup \
     -H "x-session-id: test-session"
   ```

3. **Test user registration**:
   ```bash
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -H "x-session-id: test-session" \
     -d '{
       "username": "testuser",
       "email": "test@example.com",
       "password": "TestPass123",
       "csrfToken": "your-csrf-token"
     }'
   ```

### 6. Verify Database Connection

Check that users are being created in your MongoDB Atlas cluster:

1. Go to your cluster in MongoDB Atlas
2. Click "Browse Collections"
3. Look for the `users` collection
4. Verify that user documents are being created

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Verify your connection string
   - Check network access settings
   - Ensure database user has correct permissions

2. **JWT Secret Error**:
   - Make sure JWT_SECRET is set in environment variables
   - Ensure it's at least 32 characters long

3. **CSRF Token Error**:
   - Verify that `x-session-id` header is being sent
   - Check that CSRF token is being generated correctly

4. **Rate Limiting**:
   - Check if you're hitting rate limits
   - Verify IP address detection is working

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` and check the console for detailed error messages.

## Production Deployment

### Environment Variables for Production

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
```

### Security Checklist

- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS settings
- [ ] Set up proper MongoDB Atlas security
- [ ] Use environment-specific database connections
- [ ] Enable MongoDB Atlas monitoring
- [ ] Set up proper logging and monitoring

### Performance Optimization

1. **Database Indexes**: The User model automatically creates indexes for email and username
2. **Connection Pooling**: Mongoose connection is optimized for production
3. **Rate Limiting**: Configured to prevent abuse
4. **Caching**: Consider adding Redis for session caching in high-traffic scenarios

## Next Steps

After successful setup:

1. **Test Authentication Flow**: Register and login users
2. **Implement Protected Routes**: Use the auth middleware
3. **Add User Profile**: Extend the user model as needed
4. **Email Verification**: Add email verification flow
5. **Password Reset**: Implement forgot password functionality
6. **OAuth Integration**: Add social login options

## Support

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set
3. Test database connectivity
4. Review the authentication logs
5. Check the comprehensive documentation in `AUTHENTICATION_README.md` 