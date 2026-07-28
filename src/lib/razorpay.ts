import crypto from 'crypto'

export function verifyPaymentSignature(params: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  secret: string
}): boolean {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, secret } = params
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !secret) return false
  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expected = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex')
    
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))
  } catch (e) {
    return false
  }
}

export function verifyWebhookSignature(payloadRaw: string, signature: string, webhookSecret: string): boolean {
  if (!payloadRaw || !signature || !webhookSecret) return false
  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(payloadRaw)
    .digest('hex')
    
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch (e) {
    return false; // Will throw if lengths don't match
  }
}


