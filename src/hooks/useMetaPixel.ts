'use client';

/**
 * useMetaPixel — Unified Client-Side Hook
 *
 * Each helper fires TWO signals simultaneously:
 *   1. fbq()  — browser-side Meta Pixel (for retargeting audiences)
 *   2. POST /api/meta-pixel — server-side CAPI (bypass ad blockers)
 *
 * Both calls share the SAME eventId so Facebook deduplicates them
 * and counts only one event, not two.
 */

import { useCallback } from 'react';

// ─── Cookie helpers ───────────────────────────────────────────────────────────

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// ─── Browser pixel helper (fbq) ───────────────────────────────────────────────

function fireFbq(eventName: string, data: Record<string, unknown>, eventId: string): void {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, data, { eventID: eventId });
  }
}

// ─── CAPI helper (server-side relay) ─────────────────────────────────────────

async function fireCapi(payload: Record<string, unknown>): Promise<void> {
  try {
    await fetch('/api/meta-pixel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('[MetaPixel] CAPI call failed:', err);
  }
}

// ─── Combined fire — browser pixel + CAPI with shared eventId ────────────────

function fireEvent(
  eventName: string,
  fbqData: Record<string, unknown>,
  capiPayload: Record<string, unknown>
): void {
  const eventId = crypto.randomUUID();

  // 1. Browser pixel (instant, synchronous)
  fireFbq(eventName, fbqData, eventId);

  // 2. CAPI relay (async, non-blocking)
  fireCapi({ ...capiPayload, eventName, eventId });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMetaPixel() {
  const getBaseCapiPayload = useCallback(() => ({
    eventTime: Math.floor(Date.now() / 1000),
    eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
    actionSource: 'website' as const,
    customer: {
      fbp: getCookie('_fbp'),
      fbc: getCookie('_fbc'),
    },
  }), []);

  // ── ViewContent ─────────────────────────────────────────────────────────────
  const trackViewContent = useCallback(
    (params: {
      contentName: string;
      contentIds?: string[];
      value?: number;
      currency?: string;
    }) => {
      fireEvent(
        'ViewContent',
        // fbq data
        {
          content_name: params.contentName,
          content_ids: params.contentIds,
          value: params.value,
          currency: params.currency ?? 'INR',
          content_type: 'product',
        },
        // CAPI payload
        {
          ...getBaseCapiPayload(),
          contentName: params.contentName,
          contentIds: params.contentIds,
          value: params.value,
          currency: params.currency ?? 'INR',
        }
      );
    },
    [getBaseCapiPayload]
  );

  // ── AddToCart ───────────────────────────────────────────────────────────────
  const trackAddToCart = useCallback(
    (params: {
      contentName: string;
      contentIds: string[];
      contents: { id: string; quantity: number; item_price: number }[];
      value: number;
      currency?: string;
      contentType?: string;
    }) => {
      fireEvent(
        'AddToCart',
        {
          content_name: params.contentName,
          content_ids: params.contentIds,
          contents: params.contents,
          value: params.value,
          currency: params.currency ?? 'INR',
          content_type: params.contentType ?? 'product',
        },
        {
          ...getBaseCapiPayload(),
          contentName: params.contentName,
          contentIds: params.contentIds,
          contents: params.contents,
          value: params.value,
          currency: params.currency ?? 'INR',
          contentType: params.contentType ?? 'product',
        }
      );
    },
    [getBaseCapiPayload]
  );

  // ── InitiateCheckout ────────────────────────────────────────────────────────
  const trackInitiateCheckout = useCallback(
    (params: {
      contentName?: string;
      contentIds?: string[];
      contents?: { id: string; quantity: number; item_price: number }[];
      value: number;
      currency?: string;
      contentType?: string;
      orderId?: string;
      searchString?: string;
      customer?: Record<string, unknown>;
    }) => {
      fireEvent(
        'InitiateCheckout',
        {
          content_name: params.contentName,
          content_ids: params.contentIds,
          contents: params.contents,
          value: params.value,
          currency: params.currency ?? 'INR',
          content_type: params.contentType ?? 'product',
          order_id: params.orderId,
          search_string: params.searchString,
        },
        {
          ...getBaseCapiPayload(),
          contentName: params.contentName,
          contentIds: params.contentIds,
          contents: params.contents,
          value: params.value,
          currency: params.currency ?? 'INR',
          contentType: params.contentType ?? 'product',
          orderId: params.orderId,
          searchString: params.searchString,
          customer: {
            ...getBaseCapiPayload().customer,
            ...(params.customer || {}),
          },
        }
      );
    },
    [getBaseCapiPayload]
  );

  // ── AddPaymentInfo ──────────────────────────────────────────────────────────
  const trackAddPaymentInfo = useCallback(
    (params?: { customer?: Record<string, unknown> }) => {
      fireEvent(
        'AddPaymentInfo',
        {},
        {
          ...getBaseCapiPayload(),
          customer: {
            ...getBaseCapiPayload().customer,
            ...(params?.customer || {}),
          },
        }
      );
    },
    [getBaseCapiPayload]
  );

  // ── Purchase ────────────────────────────────────────────────────────────────
  const trackPurchase = useCallback(
    (params: {
      contentName?: string;
      contentIds?: string[];
      contents?: { id: string; quantity: number; item_price: number }[];
      value: number;
      currency?: string;
      contentType?: string;
      orderId?: string;
      customer?: {
        email?: string;
        phone?: string;
        firstName?: string;
        lastName?: string;
        city?: string;
        state?: string;
        zip?: string;
        externalId?: string;
        fbp?: string;
        fbc?: string;
      };
    }) => {
      fireEvent(
        'Purchase',
        {
          content_name: params.contentName,
          content_ids: params.contentIds,
          contents: params.contents,
          value: params.value,
          currency: params.currency ?? 'INR',
          content_type: params.contentType ?? 'product',
          order_id: params.orderId,
        },
        {
          ...getBaseCapiPayload(),
          contentName: params.contentName,
          contentIds: params.contentIds,
          contents: params.contents,
          value: params.value,
          currency: params.currency ?? 'INR',
          contentType: params.contentType ?? 'product',
          orderId: params.orderId,
          customer: {
            ...getBaseCapiPayload().customer,
            ...(params.customer || {}),
          },
        }
      );
    },
    [getBaseCapiPayload]
  );

  // ── CompleteRegistration ────────────────────────────────────────────────────
  const trackCompleteRegistration = useCallback(
    (params?: {
      status?: string;
      contentName?: string;
      customer?: Record<string, unknown>;
    }) => {
      fireEvent(
        'CompleteRegistration',
        {
          content_name: params?.contentName ?? 'Account Registration',
          status: params?.status ?? 'completed',
        },
        {
          ...getBaseCapiPayload(),
          contentName: params?.contentName ?? 'Account Registration',
          status: params?.status ?? 'completed',
          customer: {
            ...getBaseCapiPayload().customer,
            ...(params?.customer || {}),
          },
        }
      );
    },
    [getBaseCapiPayload]
  );

  // ── Search ──────────────────────────────────────────────────────────────────
  const trackSearch = useCallback(
    (params?: { searchString?: string }) => {
      fireEvent(
        'Search',
        { search_string: params?.searchString },
        {
          ...getBaseCapiPayload(),
          searchString: params?.searchString,
        }
      );
    },
    [getBaseCapiPayload]
  );

  // ── Contact ─────────────────────────────────────────────────────────────────
  const trackContact = useCallback(
    (params?: { customer?: Record<string, unknown> }) => {
      fireEvent(
        'Contact',
        {},
        {
          ...getBaseCapiPayload(),
          customer: {
            ...getBaseCapiPayload().customer,
            ...(params?.customer || {}),
          },
        }
      );
    },
    [getBaseCapiPayload]
  );

  return {
    trackViewContent,
    trackAddToCart,
    trackInitiateCheckout,
    trackAddPaymentInfo,
    trackPurchase,
    trackCompleteRegistration,
    trackSearch,
    trackContact,
  };
}
