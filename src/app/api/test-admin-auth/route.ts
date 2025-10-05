import { NextRequest, NextResponse } from 'next/server';
import { withAdminAuth, AdminRequest } from '@/lib/middleware/admin';

export const dynamic = 'force-dynamic';

export const GET = withAdminAuth(async (request: AdminRequest) => {
  try {
    console.log('Admin auth test - User:', request.user);
    
    return NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      user: request.user
    });
  } catch (error) {
    console.error('Admin auth test error:', error);
    return NextResponse.json({
      success: false,
      message: 'Admin authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
});
