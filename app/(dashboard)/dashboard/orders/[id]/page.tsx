'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ordersApi } from '@/lib/api/orders';
import { Order } from '@/types';
import { ArrowLeft, Package, MapPin, Calendar, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime, getOrderStatusColor, getOrderStatusLabel } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await ordersApi.getById(orderId);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await ordersApi.cancel(orderId);
      toast.success('Order cancelled');
      router.push('/dashboard/orders');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Order not found</p>
        <Link href="/dashboard/orders" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Orders</span>
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Order #{order.id.slice(0, 8)}
                </h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                  {getOrderStatusLabel(order.status)}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p className="font-medium text-gray-900">{formatDateTime(order.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Package className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Delivery Type</p>
                  <p className="font-medium text-gray-900 capitalize">{order.deliveryType}</p>
                </div>
              </div>

              {order.deliveryAddress && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Delivery Address</p>
                    <p className="font-medium text-gray-900">{order.deliveryAddress}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="font-medium text-gray-900 capitalize">{order.paymentStatus}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pharmacy Info */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pharmacy</h2>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">{order.pharmacy.name}</p>
              <p className="text-sm text-gray-600">{order.pharmacy.address}</p>
              <p className="text-sm text-gray-600">{order.pharmacy.city}, {order.pharmacy.state}</p>
              {order.pharmacy.phone && (
                <p className="text-sm text-gray-600">Phone: {order.pharmacy.phone}</p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.drug.name}</h3>
                    {item.drug.genericName && (
                      <p className="text-sm text-gray-600 mt-1">{item.drug.genericName}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {item.drug.dosage} • {item.drug.form}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.price)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Subtotal: {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="text-gray-900">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {order.status === 'pending' && (
              <Button
                variant="danger"
                onClick={handleCancelOrder}
                className="w-full"
              >
                Cancel Order
              </Button>
            )}

            {order.status === 'pending' && order.paymentStatus === 'pending' && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Payment is pending. Complete payment to proceed with your order.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
