
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface EditFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: any;
  onUpdateRecord: (updatedRecord: any) => void;
}

const EditFeeModal = ({ isOpen, onClose, record, onUpdateRecord }: EditFeeModalProps) => {
  const [formData, setFormData] = useState({
    status: '',
    amount: '',
    remarks: ''
  });

  useEffect(() => {
    if (record) {
      setFormData({
        status: record.status || '',
        amount: record.amount?.replace('₹', '').replace(',', '') || '',
        remarks: record.remarks || ''
      });
    }
  }, [record]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRecord = {
      ...record,
      status: formData.status,
      amount: `₹${parseInt(formData.amount).toLocaleString()}`,
      remarks: formData.remarks
    };
    onUpdateRecord(updatedRecord);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Fee Record - {record?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="status">Payment Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Fee Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Enter fee amount"
              required
            />
          </div>
          <div>
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Add any remarks..."
              rows={3}
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">Update Record</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeeModal;
