import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get the latest user profile
    const { data: profiles, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('❌ Error fetching user profiles:', error);
      return NextResponse.json({ error: 'Failed to fetch user profiles', details: error }, { status: 500 });
    }

    if (profiles.length === 0) {
      return NextResponse.json({ message: 'No user profiles found' });
    }

    const latestProfile = profiles[0];
    console.log('👤 Latest User Profile:', latestProfile);

    return NextResponse.json({
      success: true,
      profile: latestProfile,
      message: `Found user profile for ${latestProfile.username}`
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    return NextResponse.json({ error: 'Test failed', details: error }, { status: 500 });
  }
}
