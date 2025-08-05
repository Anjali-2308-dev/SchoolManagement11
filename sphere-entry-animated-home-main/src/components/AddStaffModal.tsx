import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStaff: (staff: any) => void;
}

const AddStaffModal = ({ isOpen, onClose, onAddStaff }: AddStaffModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff = {
      id: Date.now(),
      name: formData.name,
      role: formData.designation,
      subjects: [formData.department],
      classes: ['TBD'],
      joinDate: new Date().toISOString().split('T')[0],
      email: formData.email,
      phone: formData.phone,
      status: 'Active'
    };
    onAddStaff(newStaff);
    setFormData({ name: '', designation: '', department: '', email: '', phone: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Staff Member</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter staff name"
              required
            />
          </div>
          <div>
            <Label htmlFor="designation">Designation *</Label>
            <Select value={formData.designation} onValueChange={(value) => setFormData({ ...formData, designation: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select designation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics Teacher">Mathematics Teacher</SelectItem>
                <SelectItem value="English Teacher">English Teacher</SelectItem>
                <SelectItem value="Science Teacher">Science Teacher</SelectItem>
                <SelectItem value="Art Teacher">Art Teacher</SelectItem>
                <SelectItem value="Physical Education Teacher">Physical Education Teacher</SelectItem>
                <SelectItem value="Librarian">Librarian</SelectItem>
                <SelectItem value="Lab Assistant">Lab Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="department">Department *</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Physical Education">Physical Education</SelectItem>
                <SelectItem value="Administration">Administration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              pattern="[0-9]{10}"
              required
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">Add Staff</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffModal;