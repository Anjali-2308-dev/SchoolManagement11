
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface EditNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notification: any;
  onUpdateNotification: (updatedNotification: any) => void;
}

const EditNotificationModal = ({ isOpen, onClose, notification, onUpdateNotification }: EditNotificationModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    audience: '',
    deliveryMethod: 'App',
    date: ''
  });

  useEffect(() => {
    if (notification) {
      setFormData({
        title: notification.title || '',
        message: notification.message || '',
        audience: notification.audience || '',
        deliveryMethod: notification.deliveryMethod || 'App',
        date: notification.date || ''
      });
    }
  }, [notification]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedNotification = {
      ...notification,
      ...formData
    };
    onUpdateNotification(updatedNotification);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Notification</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter notification title"
              required
            />
          </div>
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter your message..."
              rows={4}
              required
            />
          </div>
          <div>
            <Label htmlFor="audience">Audience *</Label>
            <Select value={formData.audience} onValueChange={(value) => setFormData({ ...formData, audience: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Classes">All Classes</SelectItem>
                <SelectItem value="Class 10A">Class 10A</SelectItem>
                <SelectItem value="Class 10B">Class 10B</SelectItem>
                <SelectItem value="Parents Only">Parents Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="deliveryMethod">Delivery Method</Label>
            <Select value={formData.deliveryMethod} onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="App">App Only</SelectItem>
                <SelectItem value="SMS">SMS Only</SelectItem>
                <SelectItem value="Email">Email Only</SelectItem>
                <SelectItem value="App + SMS">App + SMS</SelectItem>
                <SelectItem value="App + Email">App + Email</SelectItem>
                <SelectItem value="All">All Methods</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="date">Scheduled Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">Update Notification</Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNotificationModal;
