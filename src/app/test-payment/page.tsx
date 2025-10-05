'use client';

import { useState } from 'react';

export default function PaymentTestingPage() {
  const [orderId, setOrderId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const executeAction = async (action: string) => {
    if (!orderId.trim()) {
      alert('Please enter an Order ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test/order-helper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          orderId: orderId.trim()
        }),
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        alert(`Success: ${data.message}`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to execute action');
    } finally {
      setLoading(false);
    }
  };

  const getRecentOrders = async () => {
    setLoading(true);
    try {
      // This would require another endpoint, but for now show the current order status
      await executeAction('get_order_status');
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p>Payment testing tools are not available in production.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Payment Testing Tools</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Order ID</h2>
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID (UUID)"
            className="w-full p-3 border rounded-lg mb-4"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => executeAction('get_order_status')}
              disabled={loading}
              className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Get Status
            </button>
            
            <button
              onClick={() => executeAction('expire_order')}
              disabled={loading}
              className="bg-yellow-500 text-white p-3 rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              Expire Order
            </button>
            
            <button
              onClick={() => executeAction('set_max_attempts')}
              disabled={loading}
              className="bg-red-500 text-white p-3 rounded hover:bg-red-600 disabled:opacity-50"
            >
              Set Max Attempts
            </button>
            
            <button
              onClick={() => executeAction('reset_order')}
              disabled={loading}
              className="bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Reset Order
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
          <div className="space-y-4 text-sm">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Test Scenario 3: Order Expiry</h3>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Go to checkout page and create an order</li>
                <li>Copy the Order ID from the console or database</li>
                <li>Paste it above and click &quot;Expire Order&quot;</li>
                <li>Go back to checkout and try to pay</li>
                <li>Should get &quot;Order expired&quot; message and reset</li>
              </ol>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-semibold">Test Scenario 4: Max Attempts</h3>
              <ol className="list-decimal list-inside space-y-1 mt-2">
                <li>Go to checkout page and create an order</li>
                <li>Copy the Order ID</li>
                <li>Paste it above and click &quot;Set Max Attempts&quot;</li>
                <li>Go back to checkout and try to pay</li>
                <li>Should get &quot;Maximum attempts exceeded&quot; error</li>
              </ol>
            </div>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}