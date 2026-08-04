/**
 * Meta (Facebook) Conversions API — Server-Side Library
 *
 * Sends server-side events to Facebook's Conversions API (CAPI).
 * All customer PII is SHA-256 hashed before transmission.
 * "Do Not Hash" fields (IP, user agent, fbp, fbc) are sent in plain text.
 *
 * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api
 */

import crypto from 'crypto';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface CustomerData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  zip?: string;
  externalId?: string;
  // Do Not Hash fields
  clientIpAddress?: string;
  clientUserAgent?: string;
  fbc?: string; // Click ID cookie
  fbp?: string; // Browser ID cookie
}

export interface ContentItem {
  id: string;
  quantity: number;
  item_price?: number;
}

export interface EventData {
  eventName: string;
  eventTime?: number;
  eventId?: string;
  eventSourceUrl?: string;
  actionSource?: 'website' | 'app' | 'phone_call' | 'chat' | 'email' | 'other';
  // Custom data (event-specific)
  value?: number;
  currency?: string;
  contentName?: string;
  contentIds?: string[];
  contents?: ContentItem[];
  contentType?: string;
  orderId?: string;
  searchString?: string;
  status?: string;
  // Customer info
  customer?: CustomerData;
}

// ─── Hashing ────────────────────────────────────────────────────────────────

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function hashIfPresent(value: string | undefined): string | undefined {
  if (!value || value.trim() === '') return undefined;
  return sha256(value);
}

function normalisePhone(phone: string): string {
  // Strip all non-digits, add country code if missing
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return digits;
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

// ─── Build user_data payload ─────────────────────────────────────────────────

function buildUserData(customer: CustomerData): Record<string, unknown> {
  const ud: Record<string, unknown> = {};

  // Hashed fields
  if (customer.email)     ud.em = hashIfPresent(customer.email);
  if (customer.phone)     ud.ph = sha256(normalisePhone(customer.phone));
  if (customer.firstName) ud.fn = hashIfPresent(customer.firstName);
  if (customer.lastName)  ud.ln = hashIfPresent(customer.lastName);
  if (customer.city)      ud.ct = hashIfPresent(customer.city);
  if (customer.state)     ud.st = hashIfPresent(customer.state);
  if (customer.zip)       ud.zp = hashIfPresent(customer.zip);
  if (customer.externalId) ud.external_id = hashIfPresent(customer.externalId);

  // Do Not Hash fields — send as-is
  if (customer.clientIpAddress) ud.client_ip_address = customer.clientIpAddress;
  if (customer.clientUserAgent) ud.client_user_agent = customer.clientUserAgent;
  if (customer.fbc)             ud.fbc = customer.fbc;
  if (customer.fbp)             ud.fbp = customer.fbp;

  return ud;
}

// ─── Send event ──────────────────────────────────────────────────────────────

export interface SendEventResult {
  success: boolean;
  fbTraceId?: string;
  error?: string;
}

export async function sendMetaEvent(event: EventData): Promise<SendEventResult> {
  const accessToken = process.env.META_PIXEL_ACCESS_TOKEN;
  const pixelId = process.env.META_PIXEL_ID;

  if (!accessToken || !pixelId) {
    console.warn('[MetaCAPI] Missing META_PIXEL_ACCESS_TOKEN or META_PIXEL_ID — skipping event.');
    return { success: false, error: 'Missing configuration' };
  }

  const apiVersion = 'v21.0';
  const url = `https://graph.facebook.com/${apiVersion}/${pixelId}/events?access_token=${accessToken}`;

  const eventTime = event.eventTime ?? Math.floor(Date.now() / 1000);
  const eventId   = event.eventId   ?? crypto.randomUUID();

  // Build custom_data
  const customData: Record<string, unknown> = {};
  if (event.value       !== undefined) customData.value        = event.value;
  if (event.currency)                  customData.currency     = event.currency;
  if (event.contentName)               customData.content_name = event.contentName;
  if (event.contentIds)                customData.content_ids  = event.contentIds;
  if (event.contents)                  customData.contents     = event.contents;
  if (event.contentType)               customData.content_type = event.contentType;
  if (event.orderId)                   customData.order_id     = event.orderId;
  if (event.searchString)              customData.search_string = event.searchString;
  if (event.status)                    customData.status       = event.status;

  const payload = {
    data: [
      {
        event_name:        event.eventName,
        event_time:        eventTime,
        event_id:          eventId,
        event_source_url:  event.eventSourceUrl,
        action_source:     event.actionSource ?? 'website',
        user_data:         event.customer ? buildUserData(event.customer) : {},
        custom_data:       Object.keys(customData).length > 0 ? customData : undefined,
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await response.json();

    if (!response.ok) {
      console.error('[MetaCAPI] API error:', json);
      return { success: false, error: json?.error?.message ?? 'Unknown API error' };
    }

    console.log(`[MetaCAPI] ✅ Event "${event.eventName}" sent. fbTraceId: ${json.fbtrace_id}`);
    return { success: true, fbTraceId: json.fbtrace_id };
  } catch (err: any) {
    console.error('[MetaCAPI] Fetch error:', err);
    return { success: false, error: err.message };
  }
}

// ─── Convenience helpers ─────────────────────────────────────────────────────

/** Extract fbp / fbc from a Cookie header string */
export function extractFbCookies(cookieHeader: string | null): { fbp?: string; fbc?: string } {
  if (!cookieHeader) return {};
  const pairs = cookieHeader.split(';').map(c => c.trim());
  const result: { fbp?: string; fbc?: string } = {};
  for (const pair of pairs) {
    const [key, val] = pair.split('=');
    if (key?.trim() === '_fbp') result.fbp = val?.trim();
    if (key?.trim() === '_fbc') result.fbc = val?.trim();
  }
  return result;
}
