'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Yeseva_One } from 'next/font/google';

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
});

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<'today' | '7d' | '15d' | '30d' | '6m' | '1y'>('7d');

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/stats?range=${range}`);
      const res = await response.json();
      
      if (res.success) {
        const s = res.data;
        const byStatus = s?.orders?.byStatus || {};
        setStats({
          totalOrders: s?.orders?.total || 0,
          pendingOrders: (byStatus.processing || 0) + (byStatus.created || 0),
          completedOrders: (byStatus.paid || 0) + (byStatus.delivered || 0),
          totalRevenue: s?.revenue?.total || 0,
          recentOrders: s?.recentOrders || []
        });
      } else {
        setError(res.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const formatShortOrderId = (id: string) => {
    if (!id) return '#—';
    const core = String(id).replace(/[^a-zA-Z0-9]/g, '');
    return `#${core.slice(-8).toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <div className="mb-3">
          <h2 className={`text-xl lg:text-2xl font-medium text-green-600 ${yeseva_One.className}`}>Hello, Nishchoy Gupta 👋</h2>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 lg:mt-2 text-sm lg:text-base text-gray-600">Manage your e-commerce store</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Time range</label>
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as any)}
            className="border border-gray-300 rounded-md text-sm px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="15d">Last 15 days</option>
            <option value="30d">Last 30 days</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
        <div></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-lg lg:text-2xl font-semibold text-gray-900">{stats?.totalOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-lg lg:text-2xl font-semibold text-gray-900">{stats?.pendingOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Completed Orders</p>
              <p className="text-lg lg:text-2xl font-semibold text-gray-900">{stats?.completedOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-3 lg:ml-4">
              <p className="text-xs lg:text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-lg lg:text-2xl font-semibold text-gray-900">₹{stats?.totalRevenue || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List (filtered by time range) */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-base lg:text-lg font-medium text-gray-900">Recent Orders</h2>
            <p className="text-xs lg:text-sm text-gray-500">Latest 3 orders within selected range</p>
          </div>
          <a href="/admin/orders" className="text-sm font-medium text-green-600 hover:text-green-700">View All</a>
        </div>
        {/* Desktop table */}
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
              {(stats?.recentOrders || []).map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900">{order.order_number || formatShortOrderId(order.id)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium text-gray-900">{order.user_name || '—'}</div>
                    <div className="text-gray-500 text-xs">{order.user_email || '—'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {order.created_at ? new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{(order.total_price ?? order.total_amount ?? 0).toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={
                      `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        (order.order_status || '').toLowerCase() === 'paid'
                          ? 'bg-blue-100 text-blue-800'
                          : (order.order_status || '').toLowerCase() === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : (order.order_status || '').toLowerCase() === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`
                    }>
                      {(order.order_status || order.status || '—').charAt(0).toUpperCase() + (order.order_status || order.status || '—').slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    <a href={`/admin/orders/${order.id}`} className="text-green-600 hover:text-green-700 font-medium">View Details</a>
                  </td>
                </tr>
              ))}
              {stats && stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-6 text-center text-sm text-gray-500">No orders in this range.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-gray-200">
          {(stats?.recentOrders || []).map((order: any) => (
            <div key={order.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{order.order_number || formatShortOrderId(order.id)}</div>
                  <div className="mt-1 text-sm text-gray-700">{order.user_name || '—'}</div>
                  <div className="text-xs text-gray-500 break-words">{order.user_email || '—'}</div>
                </div>
                <div className="shrink-0">
                  <span className={
                    `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      (order.order_status || '').toLowerCase() === 'paid'
                        ? 'bg-blue-100 text-blue-800'
                        : (order.order_status || '').toLowerCase() === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : (order.order_status || '').toLowerCase() === 'delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`
                  }>
                    {(order.order_status || order.status || '—').charAt(0).toUpperCase() + (order.order_status || order.status || '—').slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                <div>{order.created_at ? new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</div>
                <div className="font-medium text-gray-900">₹{(order.total_price ?? order.total_amount ?? 0).toFixed(2)}</div>
              </div>
              <div className="mt-3">
                <a href={`/admin/orders/${order.id}`} className="inline-flex w-full items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">View Details</a>
              </div>
            </div>
          ))}
          {stats && stats.recentOrders.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">No orders in this range.</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-4 py-3 lg:px-6 lg:py-4 border-b border-gray-200">
          <h2 className="text-base lg:text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-4 lg:p-6">
          <div className="grid grid-cols-1 gap-3 lg:gap-4">
            <Link
              href="/admin/orders"
              className="flex items-center p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 lg:ml-4">
                <h3 className="text-sm font-medium text-gray-900">View All Orders</h3>
                <p className="text-xs lg:text-sm text-gray-500">Manage and track customer orders</p>
              </div>
            </Link>

            <Link
              href="/admin/orders?status=processing"
              className="flex items-center p-3 lg:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 lg:w-6 lg:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 lg:ml-4">
                <h3 className="text-sm font-medium text-gray-900">Pending Orders</h3>
                <p className="text-xs lg:text-sm text-gray-500">Review orders awaiting processing</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}