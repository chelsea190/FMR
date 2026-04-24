'use client';

import { useEffect, useState } from 'react';
import { ordersApi } from '@/lib/api';
import { Order, OrderStatus } from '@/types';
import { Package, ShoppingCart, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const statusOptions: OrderStatus[] = ['accepted', 'preparing', 'out_for_delivery', 'completed'];

export default function PharmacistOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await ordersApi.getAll({ limit: 50 });
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const refetch = async () => {
    try {
      const response = await ordersApi.getAll({ limit: 50 });
      setOrders(response.data);
    } catch {
      toast.error('Failed to refresh orders');
    }
  };

  const canAdvance = (status: OrderStatus) =>
    status === 'pending' || status === 'accepted' || status === 'preparing' || status === 'out_for_delivery';

  const handleUpdateStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await ordersApi.updateStatus(orderId, nextStatus);
      toast.success(`Order updated to ${nextStatus.replace(/_/g, ' ')}`);
      await refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    setUpdatingOrderId(orderId);
    try {
      await ordersApi.cancel(orderId);
      toast.success('Order cancelled');
      await refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to cancel order');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pharmacy Orders</h1>
        <p className="text-gray-600 mt-2">Accept, prepare, and update order progress in real-time.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center py-12">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                    <span className="text-sm text-gray-600 font-medium">
                      {order.items.length} item(s)
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span>Total: {formatCurrency(order.totalAmount)}</span>
                    </div>
                    <div>Status: {order.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}</div>
                  </div>
                </div>

                <div className="text-right min-w-[240px]">
                  <div className="flex flex-col items-end gap-2">
                    {order.status === 'pending' && (
                      <Button
                        variant="danger"
                        disabled={updatingOrderId === order.id}
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        Cancel
                      </Button>
                    )}

                    {canAdvance(order.status) ? (
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        {statusOptions.map((s) => (
                          <Button
                            key={s}
                            variant={s === 'completed' ? 'success' : 'outline'}
                            disabled={updatingOrderId === order.id || order.status === s}
                            onClick={() => handleUpdateStatus(order.id, s)}
                          >
                            {s.replace(/_/g, ' ')}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        Status changes available once order advances.
                      </div>
                    )}
                    <Button variant="secondary" disabled={updatingOrderId === order.id} onClick={() => refetch()}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="grid md:grid-cols-2 gap-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.drug.name}</p>
                        {item.drug.genericName && (
                          <p className="text-xs text-gray-600 truncate">{item.drug.genericName}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-primary-600">{item.quantity}x</p>
                        <p className="text-xs text-gray-600">{formatCurrency(item.subtotal)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

