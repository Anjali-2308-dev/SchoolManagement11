
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const Diary = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    id: null,
    date: new Date().toISOString().split('T')[0],
    class: '',
    subject: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (editingId) {
      await axios.put(`http://localhost:5000/AddDiary/${editingId}`, formData);
      setEntries(prev => prev.map(entry =>
  entry._id === editingId ? { ...entry, ...formData } : entry
));
        
    } else {
      const response = await axios.post(`http://localhost:5000/AddDiary`, formData);
      setEntries(prev => [...prev, response.data]);
    }

    setFormData({ date: new Date().toISOString().split('T')[0], class: '', subject: '', notes: '' });
    setShowAddForm(false);
    setEditingId(null);
  } catch (err) {
    console.error('Error submitting:', err);
  }
};

const handleEdit = (entry) => {
  setFormData({
    date: entry.date,
    class: entry.class,
    subject: entry.subject,
    notes: entry.notes,
  });
  setEditingId(entry._id);
  setShowAddForm(true);
};

const handleDelete = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/AddDiary/${id}`);
    setEntries(prev => prev.filter(entry => entry._id !== id));
  } catch (err) {
    console.error('Error deleting:', err);
  }
};


useEffect(() => {
  const fetchEntries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/AddDiary');
      setEntries(res.data);
    } catch (err) {
      console.error('Error fetching entries:', err);
    }
  };

  fetchEntries();
}, []);


  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Class Diary</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-orange-600 hover:bg-orange-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Entry' : 'Add New Entry'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Class</label>
                    <Input
                      value={formData.class}
                      onChange={(e) => setFormData({...formData, class: e.target.value})}
                      placeholder="Enter class"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      placeholder="Enter subject"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Enter class notes..."
                    rows={4}
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingId ? 'Update' : 'Add'} Entry
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowAddForm(false);
                    setEditingId(null);
                    setFormData({ date: new Date().toISOString().split('T')[0], class: '', subject: '', notes: '' });
                  }}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {entries.map((entry) => (
            <Card key={entry._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <h3 className="font-semibold">{entry.date}</h3>
                      <p className="text-sm text-gray-600">{entry.class} - {entry.subject}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(entry)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(entry._id)}>
  <Trash2 className="w-4 h-4" />
</Button>
                  </div>
                </div>
                <p className="text-gray-700">{entry.notes}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Diary;
