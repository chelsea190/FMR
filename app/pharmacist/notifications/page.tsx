'use client';

import { useEffect, useMemo, useState } from 'react';
import { inventoryApi } from '@/lib/api';
import { PharmacyDrug } from '@/types';
import { Bell, AlertTriangle, Package, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function PharmacistNotificationsPage() {
  const [inventory, setInventory] = useState<PharmacyDrug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [threshold, setThreshold] = useState(10);

  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const data = await inventoryApi.getMyInventory();
        setInventory(data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast.error('Failed to load inventory');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const lowStock = useMemo(() => inventory.filter((i) => i.stock > 0 && i.stock <= threshold), [inventory, threshold]);
  const outOfStock = useMemo(() => inventory.filter((i) => i.stock <= 0), [inventory]);

  const refetch = async () => {
    try {
      const data = await inventoryApi.getMyInventory();
      setInventory(data);
      toast.success('Notifications refreshed');
    } catch {
      toast.error('Failed to refresh');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Low stock alerts generated from your real-time inventory.
        </p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Alert Threshold</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm">
              Items with stock between `1` and `{threshold}` units appear in low-stock notifications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={50}
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="w-56 accent-primary-600 dark:accent-primary-400"
            />
            <div className="text-sm font-semibold text-primary-700">{threshold} units</div>
            <Button variant="secondary" onClick={refetch}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Low Stock</h2>
              </div>
              <span className="text-sm font-semibold text-primary-700">{lowStock.length}</span>
            </div>

            {lowStock.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No low-stock items for the current threshold.</p>
            ) : (
              <div className="space-y-3">
                {lowStock.slice(0, 10).map((item) => (
                  <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{item.drug.name}</p>
                        {item.drug.genericName && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{item.drug.genericName}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {item.drug.dosage} • {item.drug.form}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary-700">{item.stock} units</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCurrency(item.price)} / unit
                        </p>
                      </div>
                    </div>
                    {item.expiryDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Expiry: {formatDate(item.expiryDate)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package className="h-6 w-6 text-danger-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Out of Stock</h2>
              </div>
              <span className="text-sm font-semibold text-danger-700">{outOfStock.length}</span>
            </div>

            {outOfStock.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">All items are available.</p>
            ) : (
              <div className="space-y-3">
                {outOfStock.slice(0, 10).map((item) => (
                  <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{item.drug.name}</p>
                        {item.drug.genericName && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{item.drug.genericName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-danger-700">0 units</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(item.price)} / unit</p>
                      </div>
                    </div>
                    {item.expiryDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Expiry: {formatDate(item.expiryDate)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

