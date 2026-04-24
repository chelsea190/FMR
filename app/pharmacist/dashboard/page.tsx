'use client';

import { useEffect, useMemo, useState } from 'react';
import { inventoryApi, ordersApi } from '@/lib/api';
import { Order, PharmacyDrug } from '@/types';
import { Bell, Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function PharmacistDashboardPage() {
  const [inventory, setInventory] = useState<PharmacyDrug[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const lowStockThreshold = 10;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [invData, ordersData] = await Promise.all([
          inventoryApi.getMyInventory(),
          ordersApi.getAll({ limit: 20 }),
        ]);

        setInventory(invData);
        setOrders(ordersData.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const lowStock = inventory.filter((i) => i.stock > 0 && i.stock <= lowStockThreshold).length;
    const outOfStock = inventory.filter((i) => i.stock <= 0).length;
    const totalDrugs = inventory.length;
    const pendingOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled').length;
    return { lowStock, outOfStock, totalDrugs, pendingOrders };
  }, [inventory, orders]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
      </div>
    );
  }

  const lowStockItems = inventory
    .filter((i) => i.stock <= lowStockThreshold)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Pharmacist Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 text-lg">
          Real-time inventory and order status at a glance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Low Stock</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.lowStock}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-2xl shadow-lg">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Out of Stock</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.outOfStock}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-danger-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-br from-danger-500 to-danger-600 p-4 rounded-2xl shadow-lg">
                <Bell className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Pending Orders</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.pendingOrders}</p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory + Orders quick panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Low-Stock Alerts</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Drugs with stock at or below {lowStockThreshold} units.
              </p>
            </div>
            <Link href="/pharmacist/inventory" className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
              Manage inventory →
            </Link>
          </div>

          {lowStockItems.length === 0 ? (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-success-100 dark:bg-success-900/30">
                <TrendingUp className="h-7 w-7 text-success-600 dark:text-success-300" />
              </div>
              <p className="text-gray-700 dark:text-gray-200 mt-3">All items are above the threshold.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">{item.drug.name}</p>
                    {item.drug.genericName && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{item.drug.genericName}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">{item.stock} units</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatCurrency(item.price)} per unit
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Pharmacy Points</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
                Redeem benefits as rewards become available.
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {[
              { k: 'Upload inventory', v: '+20 points' },
              { k: 'Update stock', v: '+10 points' },
              { k: 'Fulfill an order', v: '+25 points' },
              { k: 'Quick responses', v: '+15 points' },
              { k: 'High ratings', v: '+30 weekly bonus' },
            ].map((row) => (
              <div key={row.k} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-200">{row.k}</span>
                <span className="text-sm font-semibold text-primary-700">{row.v}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button
              variant="secondary"
              onClick={() => toast('Points details are synced once backend is connected.')}
            >
              View Rewards (coming soon)
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            This screen is UI-ready and will reflect backend-driven points when integration is enabled.
          </p>
        </div>
      </div>
    </div>
  );
}

