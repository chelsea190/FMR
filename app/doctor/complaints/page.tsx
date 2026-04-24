'use client';

import { useEffect, useMemo, useState } from 'react';
import { prescriptionsApi } from '@/lib/api/prescriptions';
import { Prescription } from '@/types';
import toast from 'react-hot-toast';
import { Eye, FileText, Upload, Trash2, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function DoctorComplaintsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<Prescription | null>(null);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    file: null as File | null,
  });

  const pendingComplaints = useMemo(
    () => prescriptions.filter((p) => p.status === 'pending'),
    [prescriptions]
  );

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const response = await prescriptionsApi.getAll({ limit: 100 });
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load complaints');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const openIssueModal = (p: Prescription) => {
    setActiveComplaint(p);
    setUploadData({
      title: p.title ? `Prescription: ${p.title}` : 'Prescription Response',
      description: p.description ? `Re: ${p.description}` : '',
      file: null,
    });
    setShowModal(true);
  };

  const handleUpload = async () => {
    if (!uploadData.file) {
      toast.error('Please select a file');
      return;
    }
    if (!uploadData.title.trim()) {
      toast.error('Please provide a title');
      return;
    }

    try {
      // Backend integration will associate this upload with the complaint context.
      await prescriptionsApi.upload(
        uploadData.file,
        uploadData.title.trim(),
        uploadData.description.trim() || undefined
      );
      toast.success('Prescription response uploaded');
      setShowModal(false);
      setActiveComplaint(null);
      setUploadData({ title: '', description: '', file: null });
      await fetchPrescriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload prescription');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this complaint record?')) return;
    try {
      await prescriptionsApi.delete(id);
      toast.success('Complaint deleted');
      await fetchPrescriptions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complaints</h1>
        <p className="text-gray-600 mt-2">Review patient complaints and upload prescription responses.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto" />
        </div>
      ) : pendingComplaints.length === 0 ? (
        <div className="card text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No pending complaints yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingComplaints.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between mb-4 gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{p.title}</h3>
                  {p.description && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{p.description}</p>}
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    pending
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500">Uploaded: {formatDate(p.createdAt)}</p>
                <p className="text-xs text-gray-500">Type: {p.fileType}</p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <a
                  href={p.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 btn btn-secondary text-center py-2.5"
                >
                  <Eye className="h-4 w-4 mr-2 inline" />
                  View
                </a>
                <Button variant="outline" onClick={() => openIssueModal(p)} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Issue
                </Button>
              </div>

              <div className="flex items-center justify-end pt-3">
                <Button variant="danger" onClick={() => handleDelete(p.id)} className="p-2">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issue Modal */}
      {showModal && activeComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Issue Prescription Response
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              For: <span className="font-medium">{activeComplaint.title}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={uploadData.description}
                  onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                  className="input"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prescription File *</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadData({ ...uploadData, file: e.target.files[0] });
                    }
                  }}
                  className="input"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                  setActiveComplaint(null);
                  setUploadData({ title: '', description: '', file: null });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!uploadData.file}>
                <FileText className="h-4 w-4 mr-2 inline" />
                Upload Response
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

