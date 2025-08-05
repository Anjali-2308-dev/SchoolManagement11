import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface AddBusFormProps {
  onClose: () => void;
}

const AddBusForm = ({ onClose }: AddBusFormProps) => {
  const [formData, setFormData] = useState({
    busId: '',
    routeName: '',
    driver: {
      name: '',
      license: '',
      contact: '',
    },
    currentStop: '',
    eta: '',
    status: 'On Time',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('driver.')) {
      const key = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        driver: {
          ...prev.driver,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/addbus', formData); // ✅ Backend Endpoint
      onClose(); // Close modal after submission
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Card className="w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] 2xl:w-[25%] h-[95vh] md:h-[90vh] overflow-hidden bg-white shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-center text-lg md:text-xl lg:text-2xl">
            Add New Bus
          </CardTitle>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-[80vh] md:max-h-[70vh] pr-2">
          <form onSubmit={handleSubmit} className="space-y-4 px-2 md:px-4">
            <div>
              <Label>Driver Name</Label>
              <Input
                name="driver.name"
                value={formData.driver.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Bus ID</Label>
              <Input
                name="busId"
                value={formData.busId}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Route Name</Label>
              <Select
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, routeName: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Route A">Route A</SelectItem>
                  <SelectItem value="Route B">Route B</SelectItem>
                  <SelectItem value="Route C">Route C</SelectItem>
                  <SelectItem value="Route D">Route D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Driver Contact</Label>
              <Input
                name="driver.contact"
                value={formData.driver.contact}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>License Number</Label>
              <Input
                name="driver.license"
                value={formData.driver.license}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Current Stop</Label>
              <Input
                name="currentStop"
                value={formData.currentStop}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>ETA</Label>
              <Input
                name="eta"
                value={formData.eta}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select
                onValueChange={(val) =>
                  setFormData((prev) => ({ ...prev, status: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Time">On Time</SelectItem>
                  <SelectItem value="Delayed">Delayed</SelectItem>
                  <SelectItem value="Arrived">Arrived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2 pb-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Add Bus
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBusForm;
