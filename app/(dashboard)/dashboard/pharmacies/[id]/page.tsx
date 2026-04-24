'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { pharmacyApi } from '@/lib/api/pharmacy';
import { ordersApi } from '@/lib/api/orders';
import { Pharmacy, PharmacyDrug } from '@/types';
import { MapPin, Phone, ShoppingCart, Search } from 'lucide-react';
import { formatCurrency, formatDistance } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function PharmacyDetailPage() {
  const params = useParams();
  const pharmacyId = params.id as string;

  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [inventory, setInventory] = useState<PharmacyDrug[]>([]);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pharmacyData, inventoryData] = await Promise.all([
          pharmacyApi.getById(pharmacyId),
          pharmacyApi.getInventory(pharmacyId),
        ]);
        setPharmacy(pharmacyData);
        setInventory(inventoryData);
      } catch (error) {
        console.error('Error fetching pharmacy data:', error);
        toast.error('Failed to load pharmacy data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pharmacyId]);

  const filteredInventory = inventory.filter((item) =>
    item.drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.drug.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (drugId: string) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      const currentQty = newCart.get(drugId) || 0;
      newCart.set(drugId, currentQty + 1);
      return newCart;
    });
    toast.success('Added to cart');
  };

  const removeFromCart = (drugId: string) => {
    setCart((prev) => {
      const newCart = new Map(prev);
      const currentQty = newCart.get(drugId) || 0;
      if (currentQty <= 1) {
        newCart.delete(drugId);
      } else {
        newCart.set(drugId, currentQty - 1);
      }
      return newCart;
    });
  };

  const getCartTotal = () => {
    let total = 0;
    cart.forEach((qty, drugId) => {
      const item = inventory.find((i) => i.drug.id === drugId);
      if (item) {
        total += item.price * qty;
      }
    });
    return total;
  };

  const handleCheckout = async () => {
    if (cart.size === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const items = Array.from(cart.entries()).map(([drugId, quantity]) => ({
        drugId,
        quantity,
      }));

      await ordersApi.create({
        pharmacyId,
        items,
        deliveryType: 'pickup', // Default to pickup, user can change later
      });

      toast.success('Order placed successfully!');
      setCart(new Map());
      // Redirect to orders page
      window.location.href = '/dashboard/orders';
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  if (!pharmacy) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-600">Pharmacy not found</p>
      </div>
    );
  }

  return (
    <div>
      {/* Pharmacy Info */}
      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{pharmacy.name}</h1>
            {pharmacy.isVerified && (
              <span className="inline-block px-3 py-1 bg-success-100 text-success-700 text-sm font-medium rounded">
                Verified Pharmacy
              </span>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="text-gray-900">{pharmacy.address}</p>
              <p className="text-gray-600">{pharmacy.city}, {pharmacy.state}</p>
            </div>
          </div>

          {pharmacy.phone && (
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-gray-900">{pharmacy.phone}</p>
              </div>
            </div>
          )}

          {pharmacy.distance !== undefined && (
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Distance</p>
                <p className="text-gray-900 font-medium">{formatDistance(pharmacy.distance)} away</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Inventory */}
        <div className="lg:col-span-2">
          <div className="card mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredInventory.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600">No medications found</p>
              </div>
            ) : (
              filteredInventory.map((item) => {
                const cartQty = cart.get(item.drug.id) || 0;
                return (
                  <div key={item.id} className="card">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.drug.name}</h3>
                        {item.drug.genericName && (
                          <p className="text-sm text-gray-600 mt-1">{item.drug.genericName}</p>
                        )}
                        <p className="text-sm text-gray-500 mt-1">
                          {item.drug.dosage} • {item.drug.form}
                        </p>
                        <div className="flex items-center space-x-4 mt-3">
                          <span className="text-xl font-bold text-primary-600">
                            {formatCurrency(item.price)}
                          </span>
                          <span className={`text-sm font-medium ${
                            item.isAvailable && item.stock > 0
                              ? 'text-success-600'
                              : 'text-danger-600'
                          }`}>
                            {item.isAvailable && item.stock > 0
                              ? `${item.stock} in stock`
                              : 'Out of stock'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {item.isAvailable && item.stock > 0 && (
                      <div className="mt-4 flex items-center space-x-3">
                        {cartQty > 0 && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => removeFromCart(item.drug.id)}
                              className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{cartQty}</span>
                            <button
                              onClick={() => addToCart(item.drug.id)}
                              disabled={cartQty >= item.stock}
                              className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        )}
                        <Button
                          onClick={() => addToCart(item.drug.id)}
                          disabled={cartQty >= item.stock}
                          className="flex-1"
                        >
                          {cartQty > 0 ? 'Add More' : 'Add to Cart'}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingCart className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Cart</h2>
              {cart.size > 0 && (
                <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-full">
                  {cart.size}
                </span>
              )}
            </div>

            {cart.size === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {Array.from(cart.entries()).map(([drugId, quantity]) => {
                    const item = inventory.find((i) => i.drug.id === drugId);
                    if (!item) return null;
                    return (
                      <div key={drugId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.drug.name}</p>
                          <p className="text-xs text-gray-600">Qty: {quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(item.price * quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(getCartTotal())}
                    </span>
                  </div>
                  <Button onClick={handleCheckout} className="w-full" size="lg">
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
