import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Basic auth check - you might want to implement proper admin authentication
    const authHeader = request.headers.get('authorization');
    const adminKey = process.env.ADMIN_API_KEY; // Set this in your environment
    
    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'failure_rate';

    if (action === 'failure_rate') {
      // Get recent failure rate (last 15 minutes)
      const { data, error } = await supabaseAdmin
        .rpc('get_recent_failure_rate');

      if (error) throw error;

      const stats = data?.[0] || { total_attempts: 0, failed_attempts: 0, failure_rate: 0 };
      
      // Check if alert should be triggered (threshold: 20%)
      const alertThreshold = 20.0;
      const shouldAlert = stats.failure_rate > alertThreshold && stats.total_attempts >= 5;

      if (shouldAlert) {
        console.warn(`🚨 PAYMENT FAILURE ALERT: ${stats.failure_rate}% failure rate in last 15 minutes`, {
          total_attempts: stats.total_attempts,
          failed_attempts: stats.failed_attempts,
          threshold: alertThreshold
        });
        
        // Here you could send an email, Slack notification, etc.
        // Example: await sendAlertNotification(stats);
      }

      return NextResponse.json({
        success: true,
        data: {
          ...stats,
          alert_triggered: shouldAlert,
          threshold: alertThreshold
        }
      });

    } else if (action === 'failure_stats') {
      // Get failure stats by error code (last 24 hours)
      const { data, error } = await supabaseAdmin
        .from('payment_failure_stats_24h')
        .select('*')
        .limit(10);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: data || []
      });

    } else if (action === 'recent_issues') {
      // Get recent payment issues
      const { data, error } = await supabaseAdmin
        .from('recent_payment_issues')
        .select('*')
        .limit(20);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: data || []
      });

    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid action. Use: failure_rate, failure_stats, or recent_issues' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Payment monitoring error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch payment monitoring data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to send alert notifications (implement as needed)
async function sendAlertNotification(stats: any) {
  // Example implementation - you could send email, Slack, etc.
  console.log(`Payment failure alert: ${stats.failure_rate}% failure rate`, stats);
  
  // Email example (using your preferred email service):
  // await emailService.send({
  //   to: 'admin@kislaynaturals.com',
  //   subject: '🚨 High Payment Failure Rate Alert',
  //   body: `Failure rate: ${stats.failure_rate}% (${stats.failed_attempts}/${stats.total_attempts} attempts)`
  // });
}
