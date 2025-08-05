
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface EditPayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
  onUpdateEmployee: (updatedEmployee: any) => void;
}

const EditPayrollModal = ({ isOpen, onClose, employee, onUpdateEmployee }: EditPayrollModalProps) => {
  const [formData, setFormData] = useState({
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    position: '',
    status: '',
    department: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        baseSalary: employee.baseSalary || 0,
        allowances: employee.allowances || 0,
        deductions: employee.deductions || 0,
        position: employee.position || '',
        status: employee.status || 'Active',
        department: employee.department || ''
      });
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const netSalary = formData.baseSalary + formData.allowances - formData.deductions;
    const updatedEmployee = {
      ...employee,
      ...formData,
      netSalary
    };
    onUpdateEmployee(updatedEmployee);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Employee - {employee?.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="baseSalary">Base Salary *</Label>
            <Input
              id="baseSalary"
              type="number"
              value={formData.baseSalary}
              onChange={(e) => setFormData({ ...formData, baseSalary: parseInt(e.target.value) || 0 })}
              placeholder="Enter base salary"
              required
            />
          </div>
          <div>
            <Label htmlFor="allowances">Allowances</Label>
            <Input
              id="allowances"
              type="number"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: parseInt(e.target.value) || 0 })}
              placeholder="Enter allowances"
            />
          </div>
          <div>
            <Label htmlFor="deductions">Deductions</Label>
            <Input
              id="deductions"
              type="number"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: parseInt(e.target.value) || 0 })}
              placeholder="Enter deductions"
            />
          </div>
          <div>
            <Label htmlFor="position">Designation</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Enter designation"
            />
          </div>
          <div>
            <Label htmlFor="department">Department</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Enter department"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">Update Employee</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPayrollModal;
