import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2, Clock, Users } from 'lucide-react';
import axios from 'axios';

const Tests = () => {
  const navigate = useNavigate();
  const [tests, setTests] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    class: '',
    duration: '',
    questions: '',
    date: '', // Add date field
  });

  const fetchTests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/AddTest');
      setTests(res.data);
    } catch (err) {
      console.error('Error fetching tests:', err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      duration: Number(formData.duration),
      questions: Number(formData.questions),
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/AddTest/${editingId}`, data);
      } else {
        await axios.post('http://localhost:5000/AddTest', { ...data, status: 'Draft', attempts: 0 });
      }

      fetchTests();
      setFormData({ title: '', subject: '', class: '', duration: '', questions: '', date: '' });
      setEditingId(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const handleEdit = (test) => {
    setFormData({
      title: test.title,
      subject: test.subject,
      class: test.class,
      duration: test.duration,
      questions: test.questions,
      date: test.date || '', // Set date when editing
    });
    setEditingId(test._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/AddTest/${id}`);
      fetchTests();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const current = tests.find((test) => test._id === id);
      const newStatus = current.status === 'Published' ? 'Draft' : 'Published';
      await axios.put(`http://localhost:5000/AddTest/${id}`, { ...current, status: newStatus });
      fetchTests();
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-red-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Mock Tests</h1>
          </div>
          <Button onClick={() => setShowAddForm(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Test
          </Button>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Test' : 'Create New Test'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['title', 'subject', 'class'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-2 capitalize">{field}</label>
                      <Input
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        placeholder={`Enter ${field}`}
                        required
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="Enter duration"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Questions</label>
                    <Input
                      type="number"
                      value={formData.questions}
                      onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
                      placeholder="Enter questions"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Test Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingId ? 'Update' : 'Create'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>All Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((test) => (
                    <TableRow key={test._id}>
                      <TableCell>{test.title}</TableCell>
                      <TableCell>{test.subject}</TableCell>
                      <TableCell>{test.class}</TableCell>
                      <TableCell><Clock className="inline w-4 h-4 mr-1" />{test.duration}m</TableCell>
                      <TableCell>{test.questions}</TableCell>
                      <TableCell>{test.date ? new Date(test.date).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${test.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {test.status}
                        </span>
                      </TableCell>
                      <TableCell><Users className="inline w-4 h-4 mr-1" />{test.attempts || 0}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center space-x-2">
                          <Button size="sm" variant="outline" onClick={() => toggleStatus(test._id)}>
                            {test.status === 'Draft' ? 'Publish' : 'Unpublish'}
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEdit(test)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(test._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tests;