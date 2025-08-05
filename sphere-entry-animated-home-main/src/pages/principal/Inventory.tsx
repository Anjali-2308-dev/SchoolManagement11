import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Package, AlertTriangle, CheckCircle, XCircle, Edit, Plus } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import AddStockModal from '@/components/AddStockModal';

interface InventoryItem {
  _id: string;
  item: string;
  category: string;
  quantity: number;
  minStock: number;
  status: string;
  vendor: string;
}

const Inventory = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedItem, setEditedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/Addstock');
      setInventoryData(res.data);
    } catch (err) {
      console.error('Failed to fetch inventory:', err);
    }
  };

  const handleAddStock = async (newStock: InventoryItem) => {
    try {
      const res = await axios.post('http://localhost:5000/Addstock', newStock);
      setInventoryData(prev => [...prev, res.data]);
    } catch (err) {
      console.error('Failed to add stock:', err);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item._id);
    setEditedItem({ ...item });
  };

  const handleChange = (field: keyof InventoryItem, value: string | number) => {
    if (!editedItem) return;
    setEditedItem({
      ...editedItem,
      [field]: value,
    });
  };

  const handleSave = async () => {
  if (!editedItem || !editingId) return;
  try {
    const res = await axios.put(`http://localhost:5000/Addstock/${editingId}`, editedItem);
    const updatedItem = res.data;
    setInventoryData(prev =>
      prev.map(item => item._id === editingId ? updatedItem : item)
    );
    setEditingId(null);
    setEditedItem(null);
  } catch (err) {
    console.error('Failed to save item:', err);
  }
};

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/Addstock/${id}`);
      setInventoryData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Low Stock':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'Out of Stock':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-4 relative">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/principal')} variant="outline" size="sm" className="bg-white/70 hover:bg-white/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-teal-100">
                <Package className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                <p className="text-gray-600">Stock monitoring & supply tracking</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-2" />
            New Stock
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inventoryData.reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {inventoryData.filter(item => item.status === 'Available').reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Low Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {inventoryData.filter(item => item.status === 'Low Stock').reduce((sum, item) => sum + item.quantity, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Out of Stock</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {inventoryData.filter(item => item.status === 'Out of Stock').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Current Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Min. Required</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map(item => {
                  const isEditing = editingId === item._id;
                  return (
                    <TableRow key={item._id}>
                      <TableCell>
                        {isEditing ? (
                          <input className="border px-2 py-1 rounded w-full" value={editedItem?.item || ''} onChange={e => handleChange('item', e.target.value)} />
                        ) : item.item}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <input className="border px-2 py-1 rounded w-full" value={editedItem?.category || ''} onChange={e => handleChange('category', e.target.value)} />
                        ) : item.category}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <input type="number" className="border px-2 py-1 rounded w-full" value={editedItem?.quantity || 0} onChange={e => handleChange('quantity', Number(e.target.value))} />
                        ) : item.quantity}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <input type="number" className="border px-2 py-1 rounded w-full" value={editedItem?.minStock || 0} onChange={e => handleChange('minStock', Number(e.target.value))} />
                        ) : item.minStock}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <input className="border px-2 py-1 rounded w-full" value={editedItem?.vendor || ''} onChange={e => handleChange('vendor', e.target.value)} />
                        ) : item.vendor}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status)}
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="flex gap-2 flex-wrap">
                        {isEditing ? (
                          <>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={handleSave}>Save</Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>
                              Delete
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AddStockModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddStock={handleAddStock}
        />
      </div>
    </div>
  );
};

export default Inventory;
