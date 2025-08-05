import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// ✅ Correct Axios import
import axios from 'axios';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (stock: any) => void;
}

const AddStockModal = ({ isOpen, onClose, onAddStock }: AddStockModalProps) => {
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    category: '',
    vendor: '',
    status: 'Available',
    minStock: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStock = {
      item: formData.item,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      minStock: parseInt(formData.minStock),
      status: formData.status,
      vendor: formData.vendor,
    };

    try {
      await axios.post('http://localhost:5000/Addstock', newStock, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      onAddStock(newStock);
      setFormData({
        item: '',
        quantity: '',
        category: '',
        vendor: '',
        status: 'Available',
        minStock: '',
      });
      onClose();
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xs max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">Add New Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="item">Item Name *</Label>
            <Input
              id="item"
              value={formData.item}
              onChange={(e) =>
                setFormData({ ...formData, item: e.target.value })
              }
              placeholder="Enter item name"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Books">Books</SelectItem>
                <SelectItem value="Stationery">Stationery</SelectItem>
                <SelectItem value="Supplies">Supplies</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              placeholder="Enter quantity"
              required
            />
          </div>
          <div>
            <Label htmlFor="minStock">Minimum Stock *</Label>
            <Input
              id="minStock"
              type="number"
              value={formData.minStock}
              onChange={(e) =>
                setFormData({ ...formData, minStock: e.target.value })
              }
              placeholder="Enter minimum stock level"
              required
            />
          </div>
          <div>
            <Label htmlFor="vendor">Vendor</Label>
            <Input
              id="vendor"
              value={formData.vendor}
              onChange={(e) =>
                setFormData({ ...formData, vendor: e.target.value })
              }
              placeholder="Enter vendor name"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              Add Stock
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStockModal;