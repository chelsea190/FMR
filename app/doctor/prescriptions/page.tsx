'use client';

import { useEffect, useState } from 'react';
import { prescriptionsApi } from '@/lib/api/prescriptions';
import { Prescription } from '@/types';
import { Eye, FileText, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function DoctorPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const response = await prescriptionsApi.getAll({ limit: 100 });
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const nonPending = prescriptions.filter((p) => p.status !== 'pending');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success-100 text-success-800';
      case 'rejected':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prescription record?')) return;
    try {
      await prescriptionsApi.delete(id);
      toast.success('Prescription deleted');
      await fetchPrescriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete prescription');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
        <p className="text-gray-600 mt-2">Approved and rejected responses from patient complaints.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
        </div>
      ) : nonPending.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No prescriptions yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nonPending.map((prescription) => (
            <div key={prescription.id} className="card">
              <div className="flex items-start justify-between mb-4 gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{prescription.title}</h3>
                  {prescription.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{prescription.description}</p>
                  )}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500">Uploaded: {formatDate(prescription.createdAt)}</p>
                <p className="text-xs text-gray-500">Type: {prescription.fileType}</p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <a
                  href={prescription.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-secondary text-center py-2.5"
                >
                  <Eye className="h-4 w-4 mr-2 inline" />
                  View
                </a>
                <Button variant="danger" onClick={() => handleDelete(prescription.id)} className="p-2.5">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

