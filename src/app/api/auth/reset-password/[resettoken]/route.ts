import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: { resettoken: string } }
) {
  try {
    return NextResponse.json({ 
      success: false, 
      message: 'Use the password reset link sent to your email to reset your password.' 
    }, { status: 501 })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred while processing reset password' }, { status: 500 })
  }
}



