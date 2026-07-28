import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const supabase = supabaseAdmin;
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || ''
    if (!webhookSecret) {
      console.error('❌ RAZORPAY_WEBHOOK_SECRET not configured')
      return NextResponse.json({ success: false, message: 'Webhook not configured' }, { status: 500 })
    }

    const rawBody = await request.text()
    const signature = request.headers.get('x-razorpay-signature') || ''
    
    console.log('🔍 Webhook received:', {
      hasSignature: !!signature,
      bodyLength: rawBody.length,
      timestamp: new Date().toISOString()
    })
    
    const valid = verifyWebhookSignature(rawBody, signature, webhookSecret)
    if (!valid) {
      console.error('❌ Invalid webhook signature:', {
        signature: signature.substring(0, 20) + '...',
        bodyPreview: rawBody.substring(0, 100) + '...'
      })
      // Return 200 to prevent webhook deactivation, but log the issue
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 200 })
    }

    const evt = JSON.parse(rawBody)
    const eventType: string = evt.event
    const payload = evt.payload || {}

    console.log('📨 Processing webhook event:', {
      eventType,
      hasPayload: !!payload,
      payloadKeys: Object.keys(payload || {})
    })

    // Try to extract identifiers
    const rpOrderId: string | undefined = payload?.payment?.entity?.order_id || payload?.order?.entity?.id
    const rpPaymentId: string | undefined = payload?.payment?.entity?.id
    const amount: number | undefined = payload?.payment?.entity?.amount || payload?.order?.entity?.amount
    const currency: string | undefined = payload?.payment?.entity?.currency || payload?.order?.entity?.currency
    const receipt: string | undefined = payload?.order?.entity?.receipt
    const notes = (payload?.order?.entity?.notes || payload?.payment?.entity?.notes) as Record<string, any> | undefined
    const internalOrderId: string | undefined = (notes && (notes['internal_order_id'] as string)) || (receipt && /^[0-9a-fA-F-]{36}$/.test(receipt) ? receipt : undefined)

    console.log('🔍 Extracted identifiers:', {
      rpOrderId,
      rpPaymentId,
      amount,
      currency,
      receipt,
      internalOrderId
    })

    // Resolve our order by linkage
    let query = supabase.from('orders').select('*').limit(1)
    if (internalOrderId) {
      query = query.eq('id', internalOrderId)
    } else if (rpOrderId) {
      query = query.eq('razorpay_order_id', rpOrderId)
    }
    const { data: found } = await query.maybeSingle()

    if (!found) {
      // If we cannot link, acknowledge to avoid retries; log for manual reconciliation
      console.warn('Webhook received but order not found', { eventType, rpOrderId, rpPaymentId, receipt })
      return NextResponse.json({ success: true })
    }

    // Idempotent updates based on event types
    if (eventType === 'payment.captured') {
      if (found.status !== 'paid' && found.order_status !== 'paid') {
        await supabase
          .from('orders')
          .update({
            razorpay_payment_id: rpPaymentId,
            razorpay_order_id: rpOrderId,
            status: 'paid',
            order_status: 'paid',
            paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', found.id)
      }
    } else if (eventType === 'payment.failed') {
      // Extract failure details from the payment entity
      const paymentEntity = payload?.payment?.entity || {}
      const errorCode = paymentEntity.error_code || 'UNKNOWN_ERROR'
      const errorDescription = paymentEntity.error_description || 'Payment failed'
      const errorReason = paymentEntity.error_reason || 'payment_failed'
      
      console.log('Payment failure webhook received:', {
        orderId: found.id,
        errorCode,
        errorDescription,
        errorReason,
        paymentEntity
      });
      
      if (found.status === 'created' || found.order_status === 'created') {
        const { error } = await supabase
          .from('orders')
          .update({ 
            order_status: 'failed', // Mark as failed, not cancelled
            status: 'failed',
            last_failure_code: errorCode,
            last_failure_message: `${errorReason}: ${errorDescription}`,
            updated_at: new Date().toISOString() 
          })
          .eq('id', found.id);
          
        if (error) {
          console.error('Failed to update order with failure details:', error);
        } else {
          console.log('Order marked as failed:', found.id);
        }

        // Record the payment issue in the recent_payment_issues table
        const { error: issueError } = await supabase
          .from('recent_payment_issues')
          .insert({
            order_id: found.id,
            user_name: found.user_name,
            user_email: found.user_email,
            user_mobile: found.user_mobile,
            failure_code: errorCode,
            failure_message: `${errorReason}: ${errorDescription}`,
            failure_reason: errorReason,
            error_type: 'payment_gateway',
            payment_gateway: 'razorpay',
            amount: found.total_amount,
            currency: 'INR'
          });

        if (issueError) {
          console.error('Error recording payment issue:', issueError);
        } else {
          console.log('Payment issue recorded:', found.id);
        }
      }
    } else if (eventType === 'refund.processed') {
      // optional: mark refunded/cancelled or store refund info
      await supabase
        .from('orders')
        .update({ order_status: 'cancelled', status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', found.id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Webhook error', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}


