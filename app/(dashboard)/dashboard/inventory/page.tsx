'use client';

import { useEffect, useState } from 'react';
import { inventoryApi, drugsApi } from '@/lib/api';
import { PharmacyDrug, Drug } from '@/types';
import { Pill, Plus, Edit, Trash2, Search } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<PharmacyDrug[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PharmacyDrug | null>(null);
  const [drugSearchQuery, setDrugSearchQuery] = useState('');
  const [drugSearchResults, setDrugSearchResults] = useState<Drug[]>([]);
  const [formData, setFormData] = useState({
    drugId: '',
    price: '',
    stock: '',
    expiryDate: '',
  });

  useEffect(() => {
    fetchInventory();
  }, []);

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

  const handleDrugSearch = async (query: string) => {
    setDrugSearchQuery(query);
    if (query.length < 2) {
      setDrugSearchResults([]);
      return;
    }

    try {
      const results = await drugsApi.search(query);
      setDrugSearchResults(results);
    } catch (error) {
      console.error('Error searching drugs:', error);
    }
  };

  const handleAddDrug = async () => {
    if (!formData.drugId || !formData.price || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await inventoryApi.addDrug({
        drugId: formData.drugId,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        expiryDate: formData.expiryDate || undefined,
      });
      toast.success('Drug added to inventory');
      setShowAddModal(false);
      setFormData({ drugId: '', price: '', stock: '', expiryDate: '' });
      fetchInventory();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add drug');
    }
  };

  const handleUpdateDrug = async () => {
    if (!selectedItem) return;

    try {
      await inventoryApi.updateDrug(selectedItem.id, {
        price: formData.price ? parseFloat(formData.price) : undefined,
        stock: formData.stock ? parseInt(formData.stock) : undefined,
        expiryDate: formData.expiryDate || undefined,
      });
      toast.success('Inventory updated');
      setShowEditModal(false);
      setSelectedItem(null);
      setFormData({ drugId: '', price: '', stock: '', expiryDate: '' });
      fetchInventory();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update inventory');
    }
  };

  const handleDeleteDrug = async (id: string) => {
    if (!confirm('Are you sure you want to remove this drug from inventory?')) return;

    try {
      await inventoryApi.deleteDrug(id);
      toast.success('Drug removed from inventory');
      fetchInventory();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to remove drug');
    }
  };

  const openEditModal = (item: PharmacyDrug) => {
    setSelectedItem(item);
    setFormData({
      drugId: item.drugId,
      price: item.price.toString(),
      stock: item.stock.toString(),
      expiryDate: item.expiryDate || '',
    });
    setShowEditModal(true);
  };

  const filteredInventory = inventory.filter((item) =>
    item.drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.drug.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600 mt-2">Manage your pharmacy's drug inventory</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-5 w-5 mr-2" />
          Add Drug
        </Button>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-12"
          />
        </div>
      </div>

      {/* Add Drug Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Drug to Inventory</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Drug *
                </label>
                <input
                  type="text"
                  value={drugSearchQuery}
                  onChange={(e) => handleDrugSearch(e.target.value)}
                  className="input"
                  placeholder="Type drug name..."
                />
                {drugSearchResults.length > 0 && (
                  <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                    {drugSearchResults.map((drug) => (
                      <button
                        key={drug.id}
                        onClick={() => {
                          setFormData({ ...formData, drugId: drug.id });
                          setDrugSearchQuery(drug.name);
                          setDrugSearchResults([]);
                        }}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                      >
                        <p className="font-medium text-gray-900">{drug.name}</p>
                        {drug.genericName && (
                          <p className="text-sm text-gray-600">{drug.genericName}</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (NGN) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="input"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowAddModal(false);
                  setFormData({ drugId: '', price: '', stock: '', expiryDate: '' });
                  setDrugSearchQuery('');
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddDrug}>Add Drug</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Drug Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Inventory</h2>
            <p className="text-sm text-gray-600 mb-4">{selectedItem.drug.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (NGN)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateDrug}>Update</Button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        </div>
      ) : filteredInventory.length === 0 ? (
        <div className="card text-center py-12">
          <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No drugs in inventory</p>
          <Button onClick={() => setShowAddModal(true)} className="mt-4">
            Add Your First Drug
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.drug.name}</h3>
                  {item.drug.genericName && (
                    <p className="text-sm text-gray-600 mt-1">{item.drug.genericName}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {item.drug.dosage} • {item.drug.form}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="font-semibold text-primary-600">
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stock</span>
                  <span className={`font-medium ${
                    item.stock > 10 ? 'text-success-600' :
                    item.stock > 0 ? 'text-yellow-600' :
                    'text-danger-600'
                  }`}>
                    {item.stock} units
                  </span>
                </div>
                {item.expiryDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Expiry</span>
                    <span className="text-sm text-gray-900">{formatDate(item.expiryDate)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => openEditModal(item)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteDrug(item.id)}
                >
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
