import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function rateLimit(
  request: NextRequest,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const now = Date.now();
  const key = `rate_limit:${ip}`;
  const resetTime = now + windowMs;

  try {
    const { data, error } = await supabaseAdmin
      .from('rate_limits')
      .select('count, reset_time')
      .eq('key', key)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Rows not found"
      console.warn('Rate limit select error (is the table created?):', error.message);
      return { success: true }; // Fail open
    }

    if (data) {
      if (data.reset_time < now) {
        // Expired, reset counter
        await supabaseAdmin
          .from('rate_limits')
          .update({ count: 1, reset_time: resetTime })
          .eq('key', key);
        return { success: true };
      } else {
        // Increment counter
        const newCount = data.count + 1;
        await supabaseAdmin
          .from('rate_limits')
          .update({ count: newCount })
          .eq('key', key);
        
        if (newCount > limit) {
          return {
            success: false,
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((data.reset_time - now) / 1000),
          };
        }
        return { success: true };
      }
    } else {
      // New IP entry
      const { error: insertError } = await supabaseAdmin
        .from('rate_limits')
        .insert({ key, count: 1, reset_time: resetTime });
        
      if (insertError) {
         console.warn('Rate limit insert error:', insertError.message);
      }
      return { success: true };
    }
  } catch (err) {
    console.warn('Rate limit exception:', err);
    return { success: true }; // Fail open
  }
}