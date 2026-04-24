'use client';

import { useEffect, useMemo, useState } from 'react';
import { prescriptionsApi } from '@/lib/api/prescriptions';
import { Prescription } from '@/types';
import { HeartPulse, FileText, ClipboardList, AlertTriangle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '@/lib/utils';

export default function DoctorDashboardPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await prescriptionsApi.getAll({ limit: 50 });
        setPrescriptions(response.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => {
    const pending = prescriptions.filter((p) => p.status === 'pending').length;
    const approved = prescriptions.filter((p) => p.status === 'approved').length;
    const rejected = prescriptions.filter((p) => p.status === 'rejected').length;
    const last = prescriptions
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return { pending, approved, rejected, last };
  }, [prescriptions]);

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-600 mt-2 text-lg">Review patient requests and manage prescriptions in one place.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pending Complaints</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.pending}</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-2xl shadow-lg">
                    <ClipboardList className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Approved</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.approved}</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-success-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gradient-to-br from-success-500 to-success-600 p-4 rounded-2xl shadow-lg">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card group hover:scale-105 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Rejected</p>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.rejected}</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-danger-400/20 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                  <div className="relative bg-gradient-to-br from-danger-500 to-danger-600 p-4 rounded-2xl shadow-lg">
                    <AlertTriangle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Next tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HeartPulse className="h-6 w-6 text-primary-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">Patient Complaint Handling</h2>
                </div>
              </div>

              {stats.pending === 0 ? (
                <p className="text-gray-600">No pending complaints right now.</p>
              ) : (
                <div className="space-y-3">
                  {prescriptions
                    .filter((p) => p.status === 'pending')
                    .slice(0, 5)
                    .map((p) => (
                      <div key={p.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{p.title}</p>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.description || 'No description provided.'}</p>
                            <p className="text-xs text-gray-500 mt-2">Uploaded: {formatDate(p.createdAt)}</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            pending
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Points System</h2>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                UI-ready rewards rules for doctor activity.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Respond to patient complaint</span>
                  <span className="font-semibold text-primary-700">+20</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Issue prescription</span>
                  <span className="font-semibold text-primary-700">+15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quick response bonus</span>
                  <span className="font-semibold text-primary-700">+10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>High patient rating (weekly)</span>
                  <span className="font-semibold text-primary-700">+30</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Backend-driven point updates will sync here when integration is enabled.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

