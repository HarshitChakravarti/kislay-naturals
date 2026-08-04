/**
 * Meta Conversions API — Route Handler
 *
 * POST /api/meta-pixel
 *
 * Accepts event data from the browser and forwards it to the Facebook
 * Conversions API from the server. This keeps the access token secure
 * and enables server-side deduplication with browser Pixel events.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendMetaEvent, extractFbCookies, type EventData } from '@/lib/meta-conversions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Enrich with server-detected IP & UA (authoritative source)
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const userAgent = req.headers.get('user-agent') || '';

    // Extract fbp / fbc from the incoming request cookies
    const cookieHeader = req.headers.get('cookie');
    const { fbp, fbc } = extractFbCookies(cookieHeader);

    // Merge server-sourced values into customer data
    const eventData: EventData = {
      ...body,
      customer: {
        ...(body.customer || {}),
        clientIpAddress: clientIp,
        clientUserAgent: userAgent,
        fbp: body.customer?.fbp || fbp,
        fbc: body.customer?.fbc || fbc,
      },
      // Ensure event source URL is set
      eventSourceUrl: body.eventSourceUrl || req.headers.get('referer') || undefined,
    };

    const result = await sendMetaEvent(eventData);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, fbTraceId: result.fbTraceId });
  } catch (err: any) {
    console.error('[/api/meta-pixel] Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
