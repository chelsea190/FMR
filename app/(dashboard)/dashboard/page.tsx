'use client';

import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api/orders';
import { User, Order } from '@/types';
import { Package, ShoppingCart, MessageCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user: authUser } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  // Use authenticated user data
  const userName = authUser?.firstName ? `${authUser.firstName}${authUser.lastName ? ' ' + authUser.lastName : ''}` : 'User';

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent orders
        const ordersResponse = await ordersApi.getAll({ limit: 5 });
        setRecentOrders(ordersResponse.data);

        // Calculate stats
        const allOrdersResponse = await ordersApi.getAll();
        const allOrders = allOrdersResponse.data;
        setStats({
          totalOrders: allOrders.length,
          pendingOrders: allOrders.filter((o) => o.status === 'pending').length,
          completedOrders: allOrders.filter((o) => o.status === 'completed').length,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-8 animate-fade-in-down">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">Here's what's happening with your account today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Orders</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalOrders}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pending Orders</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-2xl shadow-lg">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Completed</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.completedOrders}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-success-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative bg-gradient-to-br from-success-500 to-success-600 p-4 rounded-2xl shadow-lg">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/pharmacies" className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Find Pharmacies</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Search nearby pharmacies</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/chat" className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Messages</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Chat with pharmacists</p>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/prescriptions" className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-lg group-hover:blur-xl transition-all"></div>
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Prescriptions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage your prescriptions</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="card animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-xl"></div>
              <Package className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto relative" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">No orders yet</p>
            <Link href="/dashboard/pharmacies" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-2 inline-block font-medium transition-colors">
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order, index) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 hover:scale-[1.02] animate-fade-in-up"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{order.pharmacy.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white text-lg">{formatCurrency(order.totalAmount)}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                    order.status === 'completed' ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300' :
                    order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
