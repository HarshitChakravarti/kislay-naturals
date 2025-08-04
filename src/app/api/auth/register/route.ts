import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface UserData {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  emailVerified: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function POST(request: Request) {
  // Set content type to JSON
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return new NextResponse(
        JSON.stringify({ success: false, message: 'Invalid JSON in request body' }),
        { status: 400, headers }
      );
    }
    
    const { name, email, password } = body;

    // Basic validation
    if (!name || !email || !password) {
      return new NextResponse(
        JSON.stringify({ 
          success: false, 
          message: 'Name, email, and password are required' 
        }),
        { status: 400, headers }
      );
    }

    if (password.length < 8) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: 'Password must be at least 8 characters long' 
        }),
        { status: 400, headers }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: 'Please enter a valid email address' 
        }),
        { status: 400, headers }
      );
    }

    const { db } = await connectToDatabase();

    // Check if user already exists (case-insensitive email check)
    const existingUser = await db.collection('users').findOne({
      email: { $regex: new RegExp(`^${email}$`, 'i') }
    });
    
    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: 'An account with this email already exists' 
        }),
        { status: 400, headers }
      );
    }

    // Hash password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: 'Error creating user account' 
        }),
        { status: 500, headers }
      );
    }

    // Create user with proper typing
    const newUser: UserData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      emailVerified: false,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await db.collection('users').insertOne(newUser);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: 'Error creating user account' 
        }),
        { status: 500, headers }
      );
    }

    // In a real app, you would send an email verification link here
    console.log(`New user registered: ${email}`);
    
    // Create a clean user object for the response
    const userResponse = {
      _id: newUser._id?.toString() || '',
      name: newUser.name,
      email: newUser.email,
      emailVerified: newUser.emailVerified,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt
    };
    
    // Create response data with proper typing
    const responseData = {
      success: true as const,
      message: 'Registration successful' as const,
      user: userResponse
    };
    
    return new NextResponse(
      JSON.stringify(responseData),
      { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        message: 'An error occurred during registration. Please try again.' 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  }
}
