'use client';

import { useEffect, useState } from 'react';
import { pharmacyApi } from '@/lib/api/pharmacy';
import { Pharmacy } from '@/types';
import { MapPin, Search, Phone, Clock } from 'lucide-react';
import { formatDistance } from '@/lib/utils';
import Link from 'next/link';

export default function PharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to default location (Lagos, Nigeria)
          setUserLocation({ lat: 6.5244, lng: 3.3792 });
        }
      );
    } else {
      // Fallback to default location
      setUserLocation({ lat: 6.5244, lng: 3.3792 });
    }
  }, []);

  useEffect(() => {
    const fetchPharmacies = async () => {
      if (!userLocation) return;

      setIsLoading(true);
      try {
        const data = await pharmacyApi.getNearby({
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          radius: 10,
          search: searchQuery || undefined,
        });
        setPharmacies(data);
      } catch (error) {
        console.error('Error fetching pharmacies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPharmacies();
  }, [userLocation, searchQuery]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Find Pharmacies</h1>
        <p className="text-gray-600 mt-2">Discover nearby pharmacies and their inventory</p>
      </div>

      {/* Search Bar */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search pharmacies by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Pharmacies List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading pharmacies...</p>
        </div>
      ) : pharmacies.length === 0 ? (
        <div className="card text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No pharmacies found</p>
          <p className="text-sm text-gray-500 mt-2">Try adjusting your search or location</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pharmacies.map((pharmacy) => (
            <Link
              key={pharmacy.id}
              href={`/dashboard/pharmacies/${pharmacy.id}`}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{pharmacy.name}</h3>
                  {pharmacy.isVerified && (
                    <span className="inline-block px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded">
                      Verified
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{pharmacy.address}, {pharmacy.city}</span>
                </div>

                {pharmacy.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{pharmacy.phone}</span>
                  </div>
                )}

                {pharmacy.distance !== undefined && (
                  <div className="flex items-center space-x-2 text-sm text-primary-600 font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>{formatDistance(pharmacy.distance)} away</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <span className="text-primary-600 font-medium text-sm hover:text-primary-700">
                  View Inventory →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
