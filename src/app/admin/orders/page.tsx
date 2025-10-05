'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Order {
  id: string;
  order_number?: string;
  user_name: string;
  user_email: string;
  total_price: number;
  order_status: string;
  created_at: string;
  user_profiles?: {
    username: string;
    full_name: string;
    phone: string;
  };
}

interface OrdersResponse {
  success: boolean;
  data: Order[];
  total: number;
  pagination: {
    next?: { page: number; limit: number };
    prev?: { page: number; limit: number };
  };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<any>({});
  const [csvExporting, setCsvExporting] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const status = searchParams.get('status') || '';

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (status) {
        params.append('status', status);
      }
      
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data: OrdersResponse = await response.json();
      
      if (data.success) {
        setOrders(data.data);
        setTotal(data.total);
        setPagination(data.pagination);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatShortOrderId = (id: string) => {
    if (!id) return '#—';
    const core = String(id).replace(/[^a-zA-Z0-9]/g, '');
    return `#${core.slice(-8).toLowerCase()}`;
  };

  const handleStatusFilter = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus) {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }
    params.set('page', '1'); // Reset to first page
    router.push(`/admin/orders?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/orders?${params.toString()}`);
  };

  const handleCSVExport = async () => {
    try {
      setCsvExporting(true);
      
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (status) params.append('status', status);
      
      const response = await fetch(`/api/admin/orders/export-csv?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to export CSV');
      }
      
      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : 'orders_export.csv';
      
      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('CSV export error:', err);
      setError('Failed to export CSV');
    } finally {
      setCsvExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      created: { color: 'bg-gray-100 text-gray-800', label: 'Created' },
      paid: { color: 'bg-blue-100 text-blue-800', label: 'Paid' },
      processing: { color: 'bg-yellow-100 text-yellow-800', label: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    
    const config = (statusConfig as any)[status] || (statusConfig as any).created;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Orders</h1>
          <p className="mt-1 lg:mt-2 text-sm lg:text-base text-gray-600">Manage and track customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 lg:p-6">
        <div className={`space-y-4`}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            {/* Status Filter */}
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="block w-full lg:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Statuses</option>
                <option value="created">Created</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Range Filters */}
            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full lg:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="w-full lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full lg:w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 w-full lg:w-auto">
              <button
                onClick={() => {
                  handleStatusFilter('');
                  setStartDate('');
                  setEndDate('');
                }}
                className="flex-1 lg:flex-none px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
              
              <button
                onClick={handleCSVExport}
                disabled={csvExporting}
                className="flex-1 lg:flex-none px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {csvExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Filter Summary */}
          {(status || startDate || endDate) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm text-gray-600">Active filters:</span>
              {status && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {status}
                </span>
              )}
              {startDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  From: {startDate}
                </span>
              )}
              {endDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Until: {endDate}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-200">
          <h2 className="text-base lg:text-lg font-medium text-gray-900">
            Orders ({total} total)
          </h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">No orders match your current filters.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table Layout */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.order_number || formatShortOrderId(order.id)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.user_name || order.user_profiles?.full_name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{order.user_email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{order.total_price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.order_status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <Link href={`/admin/orders/${order.id}`} className="text-green-600 hover:text-green-900 transition-colors font-medium">View Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Layout */}
            <div className="md:hidden divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{order.order_number || formatShortOrderId(order.id)}</div>
                      <div className="mt-1 text-sm text-gray-700">{order.user_name || order.user_profiles?.full_name || 'N/A'}</div>
                      <div className="text-xs text-gray-500 break-words">{order.user_email}</div>
                    </div>
                    <div className="shrink-0">{getStatusBadge(order.order_status)}</div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                    <div>{formatDate(order.created_at)}</div>
                    <div className="font-medium text-gray-900">₹{order.total_price.toFixed(2)}</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/admin/orders/${order.id}`} className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">View Details</Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {orders.length > 0 && (pagination.next || pagination.prev) && (
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            {/* Desktop pagination */}
            <div className="hidden md:flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{page}</span> of{' '}
                  <span className="font-medium">{Math.ceil(total / limit)}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {pagination.prev && (
                    <button onClick={() => handlePageChange(pagination.prev.page)} className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50">Previous</button>
                  )}
                  {pagination.next && (
                    <button onClick={() => handlePageChange(pagination.next.page)} className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50">Next</button>
                  )}
                </nav>
              </div>
            </div>
            {/* Mobile pagination */}
            <div className="md:hidden flex items-center justify-between gap-2">
              {pagination.prev ? (
                <button onClick={() => handlePageChange(pagination.prev.page)} className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
              ) : <span />}
              <span className="text-xs text-gray-600">Page {page} of {Math.ceil(total / limit)}</span>
              {pagination.next ? (
                <button onClick={() => handlePageChange(pagination.next.page)} className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Next</button>
              ) : <span />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}