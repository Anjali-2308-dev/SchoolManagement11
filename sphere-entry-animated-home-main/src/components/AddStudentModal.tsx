import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

const AddStudentModal = ({ isOpen, onClose, onAddStudent }) => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [className, setClassName] = useState('10A');
  const [present, setPresent] = useState(true);

  const handleSubmit = () => {
    if (!name || !rollNo) return;
    onAddStudent({ name, rollNo, class: className, present });
    setName('');
    setRollNo('');
    setClassName('10A');
    setPresent(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Roll Number"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
          />
          <Label>Class</Label>
          <select
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="10A">10A</option>
            <option value="10B">10B</option>
            <option value="10C">10C</option>
          </select>

          <Label>Status</Label>
          <RadioGroup value={present ? 'present' : 'absent'} onValueChange={(val) => setPresent(val === 'present')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="present" id="present" />
              <Label htmlFor="present">Present</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="absent" id="absent" />
              <Label htmlFor="absent">Absent</Label>
            </div>
          </RadioGroup>

          <div className="text-right">
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Add Student
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal;