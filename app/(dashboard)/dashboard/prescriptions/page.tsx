'use client';

import { useEffect, useState } from 'react';
import { prescriptionsApi } from '@/lib/api/prescriptions';
import { Prescription } from '@/types';
import { FileText, Upload, Trash2, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const response = await prescriptionsApi.getAll();
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleUpload = async () => {
    if (!uploadData.file || !uploadData.title) {
      toast.error('Please provide a title and select a file');
      return;
    }

    try {
      await prescriptionsApi.upload(
        uploadData.file,
        uploadData.title,
        uploadData.description || undefined
      );
      toast.success('Prescription uploaded successfully');
      setShowUploadModal(false);
      setUploadData({ title: '', description: '', file: null });
      fetchPrescriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload prescription');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;

    try {
      await prescriptionsApi.delete(id);
      toast.success('Prescription deleted');
      fetchPrescriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete prescription');
    }
  };

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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-2">Manage your prescription documents</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Upload className="h-5 w-5 mr-2" />
          Upload Prescription
        </Button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Prescription</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="input"
                  placeholder="e.g., Blood Pressure Medication"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prescription File *
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="input"
                />
                {uploadData.file && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {uploadData.file.name}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadData({ title: '', description: '', file: null });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload}>Upload</Button>
            </div>
          </div>
        </div>
      )}

      {/* Prescriptions List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No prescriptions yet</p>
          <Button
            onClick={() => setShowUploadModal(true)}
            className="mt-4"
          >
            Upload Your First Prescription
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map((prescription) => (
            <div key={prescription.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {prescription.title}
                  </h3>
                  {prescription.description && (
                    <p className="text-sm text-gray-600 mb-2">{prescription.description}</p>
                  )}
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500">
                  Uploaded: {formatDate(prescription.createdAt)}
                </p>
                <p className="text-xs text-gray-500">
                  Type: {prescription.fileType}
                </p>
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
                <button
                  onClick={() => handleDelete(prescription.id)}
                  className="btn btn-danger p-2.5"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
