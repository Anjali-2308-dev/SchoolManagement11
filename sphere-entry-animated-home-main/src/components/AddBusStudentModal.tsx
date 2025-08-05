import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface StudentData {
  studentName: string;
  class: string;
  busId: string;
  pickupPoint: string;
  vehicle: string;
}

interface AddBusStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStudent: (student: StudentData & { _id?: string }) => void;
  buses?: string[];
}

const AddBusStudentModal: React.FC<AddBusStudentModalProps> = ({
  isOpen,
  onClose,
  onAddStudent,
  buses = []
}) => {
  const [formData, setFormData] = useState<StudentData>({
    studentName: '',
    class: '',
    busId: '',
    pickupPoint: '',
    vehicle: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/addstudentbus', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      onAddStudent(response.data);
      setFormData({
        studentName: '',
        class: '',
        busId: '',
        pickupPoint: '',
        vehicle: ''
      });
      onClose();
    } catch (err: any) {
      console.error('Failed to save student:', err.response?.data || err.message);
      alert('Failed to save student. Check console for more info.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Student to Bus</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="studentName">Student Name *</Label>
            <Input
              id="studentName"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
              required
              placeholder="Enter student name"
            />
          </div>

          <div>
            <Label htmlFor="class">Class *</Label>
            <Select
              value={formData.class}
              onValueChange={(value) => setFormData({ ...formData, class: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {['10A', '10B', '10C', '9A', '9B'].map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    Class {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
  <Label htmlFor="busId">Bus ID *</Label>
  <Input
    id="busId"
    value={formData.busId}
    onChange={(e) => setFormData({ ...formData, busId: e.target.value })}
    required
    placeholder="Enter bus ID"
  />
</div>

          <div>
            <Label htmlFor="pickupPoint">Pickup Point *</Label>
            <Input
              id="pickupPoint"
              value={formData.pickupPoint}
              onChange={(e) => setFormData({ ...formData, pickupPoint: e.target.value })}
              required
              placeholder="Enter pickup point"
            />
          </div>

          <div>
            <Label htmlFor="vehicle">Vehicle *</Label>
            <Input
              id="vehicle"
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              required
              placeholder="Enter vehicle number"
            />
          </div>

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              Assign Student
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

export default AddBusStudentModal;
