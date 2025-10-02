'use client';

import { useState } from 'react';

export default function SendOrderEmailTestPage() {
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { success: boolean; message: string; error?: string }>(null);

  async function handleSend() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/test/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: to || undefined })
      });
      const data = await res.json();
      setResult({ success: data.success, message: data.message || (data.success ? 'Sent' : 'Failed'), error: data.error });
    } catch (e) {
      setResult({ success: false, message: 'Request failed', error: e instanceof Error ? e.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 560, margin: '48px auto', padding: 16 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Send Test Order Email</h1>
      <p style={{ color: '#374151', marginBottom: 16 }}>
        Dev-only page to trigger an order confirmation email via Resend.
      </p>

      <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Recipient email (optional)</label>
      <input
        type="email"
        placeholder="you@example.com"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 6, padding: '10px 12px', marginBottom: 12 }}
      />

      <button
        onClick={handleSend}
        disabled={loading}
        style={{
          background: loading ? '#9ca3af' : '#10b981',
          color: '#fff',
          padding: '10px 14px',
          borderRadius: 6,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Sending...' : 'Send Test Email'}
      </button>

      {result && (
        <div style={{ marginTop: 16, padding: 12, borderRadius: 6, background: result.success ? '#ecfdf5' : '#fef2f2', color: result.success ? '#065f46' : '#991b1b' }}>
          <div style={{ fontWeight: 600 }}>{result.message}</div>
          {result.error ? <div style={{ marginTop: 4, fontSize: 13 }}>Error: {result.error}</div> : null}
        </div>
      )}
    </div>
  );
}


