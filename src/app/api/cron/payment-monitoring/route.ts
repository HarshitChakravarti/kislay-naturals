import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This endpoint can be called by a cron service like Vercel Cron or external cron
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const cronSecret = request.headers.get('authorization');
    if (cronSecret !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Check failure rate alert
    const { data: failureRateData } = await supabaseAdmin
      .rpc('get_recent_failure_rate');
    
    const stats = failureRateData?.[0] || { total_attempts: 0, failed_attempts: 0, failure_rate: 0 };
    const alertThreshold = 20.0;
    const shouldAlert = stats.failure_rate > alertThreshold && stats.total_attempts >= 5;

    if (shouldAlert) {
      console.error(`🚨 PAYMENT FAILURE ALERT: ${stats.failure_rate}% failure rate`, stats);
      // Here you would send notifications (email, Slack, etc.)
    }

    // 2. Expire old orders
    await supabaseAdmin.rpc('expire_old_orders');

    // 3. Log basic stats
    console.log('Payment monitoring check completed', {
      failure_rate: stats.failure_rate,
      total_attempts: stats.total_attempts,
      failed_attempts: stats.failed_attempts,
      alert_triggered: shouldAlert
    });

    return NextResponse.json({
      success: true,
      failure_rate: stats.failure_rate,
      alert_triggered: shouldAlert,
      message: 'Monitoring check completed'
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// You can also set this up as a Vercel cron job by creating vercel.json:
// {
//   "crons": [
//     {
//       "path": "/api/cron/payment-monitoring",
//       "schedule": "*/5 * * * *"
//     }
//   ]
// }
