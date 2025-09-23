'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/orders?limit=1');
      const data = await response.json();
      
      if (data.success) {
        // For now, we'll use basic stats from the orders endpoint
        // In a real app, you'd have a dedicated stats endpoint
        setStats({
          totalOrders: data.total || 0,
          pendingOrders: 0, // Would need to filter by status
          completedOrders: 0, // Would need to filter by status
          totalRevenue: 0 // Would need to sum total_price
        });
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 lg:mt-2 text-sm lg:text-base text-gray-600">Manage your e-commerce store</p>
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
