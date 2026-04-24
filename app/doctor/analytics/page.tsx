'use client';

import { useEffect, useMemo, useState } from 'react';
import { prescriptionsApi } from '@/lib/api/prescriptions';
import { Prescription } from '@/types';
import { FileText, ClipboardList, AlertTriangle, CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

type StatusKey = 'pending' | 'approved' | 'rejected';

export default function DoctorAnalyticsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setIsLoading(true);
      try {
        const response = await prescriptionsApi.getAll({ limit: 200 });
        setPrescriptions(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const statusCounts = useMemo(() => {
    const base: Record<StatusKey, number> = { pending: 0, approved: 0, rejected: 0 };
    for (const p of prescriptions) {
      if (p.status === 'pending') base.pending += 1;
      if (p.status === 'approved') base.approved += 1;
      if (p.status === 'rejected') base.rejected += 1;
    }
    return base;
  }, [prescriptions]);

  const topPharmacies = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of prescriptions) {
      if (!p.pharmacyId) continue;
      const key = p.pharmacyId;
      map.set(key, (map.get(key) || 0) + 1);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);
  }, [prescriptions]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Prescription review trends based on recent records.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Pending</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{statusCounts.pending}</p>
            </div>
            <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-2xl shadow-lg">
              <ClipboardList className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Approved</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{statusCounts.approved}</p>
            </div>
            <div className="relative bg-gradient-to-br from-success-500 to-success-600 p-4 rounded-2xl shadow-lg">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Rejected</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{statusCounts.rejected}</p>
            </div>
            <div className="relative bg-gradient-to-br from-danger-500 to-danger-600 p-4 rounded-2xl shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Top Pharmacy IDs</h2>
            </div>
            <span className="text-sm text-gray-500">Based on prescription records</span>
          </div>

          {topPharmacies.length === 0 ? (
            <p className="text-gray-600">No pharmacy-linked prescriptions found.</p>
          ) : (
            <div className="space-y-3">
              {topPharmacies.map(([pharmacyId, count]) => (
                <div key={pharmacyId} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-600">Pharmacy</p>
                    <p className="font-medium text-gray-900 truncate">{pharmacyId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Count</p>
                    <p className="text-lg font-semibold text-primary-700">{count}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <h2 className="text-2xl font-semibold text-gray-900">Predictive Insights</h2>
          </div>
          <p className="text-gray-600 text-sm">
            This analytics UI is ready for predictive stock/shortage models once historical-demand endpoints are available.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Forecast shortages</span>
              <span className="font-semibold text-primary-700">Coming soon</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Reduce rejections</span>
              <span className="font-semibold text-primary-700">Coming soon</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Faster response</span>
              <span className="font-semibold text-primary-700">Coming soon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

