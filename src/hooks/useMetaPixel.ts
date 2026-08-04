'use client';

/**
 * useMetaPixel — Client-Side Hook
 *
 * Provides typed helpers to fire Facebook Conversions API events
 * by calling POST /api/meta-pixel (server-side relay).
 *
 * Each helper:
 *  - generates a unique event_id for deduplication
 *  - reads _fbp / _fbc cookies automatically
 *  - sends the current page URL as event_source_url
 */

import { useCallback } from 'react';
// ─── Cookie helpers ──────────────────────────────────────────────────────────

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// ─── Base fire function ──────────────────────────────────────────────────────

async function fireEvent(payload: Record<string, unknown>): Promise<void> {
  try {
    await fetch('/api/meta-pixel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('[MetaPixel] Failed to send event:', err);
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useMetaPixel() {
  const getBasePayload = useCallback(() => {
    return {
      eventTime: Math.floor(Date.now() / 1000),
      eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      actionSource: 'website' as const,
      customer: {
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
      },
    };
  }, []);

  // ── ViewContent ────────────────────────────────────────────────────────────
  const trackViewContent = useCallback(
    (params: { contentName: string; contentIds?: string[]; value?: number; currency?: string }) => {
      fireEvent({
        eventName: 'ViewContent',
        eventId: crypto.randomUUID(),
        ...getBasePayload(),
        contentName: params.contentName,
        contentIds: params.contentIds,
        value: params.value,
        currency: params.currency ?? 'INR',
      });
    },
    [getBasePayload]
  );

  // ── AddToCart ──────────────────────────────────────────────────────────────
  const trackAddToCart = useCallback(
    (params: {
      contentName: string;
      contentIds: string[];
      contents: { id: string; quantity: number; item_price: number }[];
      value: number;
      currency?: string;
      contentType?: string;
    }) => {
      fireEvent({
        eventName: 'AddToCart',
        eventId: crypto.randomUUID(),
        ...getBasePayload(),
        contentName: params.contentName,
        contentIds: params.contentIds,
        contents: params.contents,
        value: params.value,
        currency: params.currency ?? 'INR',
        contentType: params.contentType ?? 'product',
      });
    },
    [getBasePayload]
  );

  // ── InitiateCheckout ───────────────────────────────────────────────────────
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
    }) => {
      fireEvent({
        eventName: 'InitiateCheckout',
        eventId: crypto.randomUUID(),
        ...getBasePayload(),
        contentName: params.contentName,
        contentIds: params.contentIds,
        contents: params.contents,
        value: params.value,
        currency: params.currency ?? 'INR',
        contentType: params.contentType ?? 'product',
        orderId: params.orderId,
        searchString: params.searchString,
      });
    },
    [getBasePayload]
  );

  // ── AddPaymentInfo ─────────────────────────────────────────────────────────
  const trackAddPaymentInfo = useCallback(
    (params?: { customer?: Record<string, unknown> }) => {
      fireEvent({
        eventName: 'AddPaymentInfo',
        eventId: crypto.randomUUID(),
        ...getBasePayload(),
        customer: {
          ...getBasePayload().customer,
          ...(params?.customer || {}),
        },
      });
    },
    [getBasePayload]
  );

  // ── Purchase ───────────────────────────────────────────────────────────────
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
      fireEvent({
        eventName: 'Purchase',
        eventId: crypto.randomUUID(),
        ...getBasePayload(),
        contentName: params.contentName,
        contentIds: params.contentIds,
        contents: params.contents,
        value: params.value,
        currency: params.currency ?? 'INR',
        contentType: params.contentType ?? 'product',
        orderId: params.orderId,
        customer: {
          ...getBasePayload().customer,
          ...(params.customer || {}),
        },
      });
    },
    [getBasePayload]
  );

  // ── CompleteRegistration ───────────────────────────────────────────────────
  const trackCompleteRegistration = useCallback(
    (params?: { status?: string; contentName?: string; customer?: Record<string, unknown> }) => {
      fireEvent({
        eventName: 'CompleteRegistration',
        eventId: crypto.randomUUID(),
        ...getBasePayload(),
        contentName: params?.contentName ?? 'Account Registration',
        status: params?.status ?? 'completed',
        customer: {
          ...getBasePayload().customer,
          ...(params?.customer || {}),
        },
      });
    },
    [getBasePayload]
  );

  // ── Search ─────────────────────────────────────────────────────────────────
  const trackSearch = useCallback(
    (params?: { searchString?: string }) => {
      fireEvent({
        eventName: 'Search',
        eventId: crypto.randomUUID(),
        ...getBasePayload(),
        searchString: params?.searchString,
      });
    },
    [getBasePayload]
  );

  // ── Contact ────────────────────────────────────────────────────────────────
  const trackContact = useCallback(
    (params?: { customer?: Record<string, unknown> }) => {
      fireEvent({
        eventName: 'Contact',
        eventId: crypto.randomUUID(),
        ...getBasePayload(),
        customer: {
          ...getBasePayload().customer,
          ...(params?.customer || {}),
        },
      });
    },
    [getBasePayload]
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
