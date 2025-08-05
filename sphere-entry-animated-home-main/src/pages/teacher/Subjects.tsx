import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Plus, Pencil } from 'lucide-react';

const classOptions = ['10A', '10B', '10C', '9A', '9B'];
const sectionOptions = ['A', 'B', 'C'];

const Subjects = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('10A');
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    teacher: '',
    className: '10A',
    section: 'A',
  });

  useEffect(() => {
    fetchSubjects();
  }, [selectedClass]);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/subjects', {
        params: { className: selectedClass },
      });
      setSubjects(res.data);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
     name: formData.name.trim(),
  teacher: formData.teacher.trim(),
  className: formData.className.trim(),
  section: formData.section.trim(),
    };
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/subjects/${editingId}`, payload);
      } else {
        await axios.post('http://localhost:5000/subjects', payload);
      }
      resetForm();
      fetchSubjects();
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      alert('Error saving subject: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (subj) => {
    setFormData({
      name: subj.name,
      teacher: subj.teacher,
      className: subj.className,
      section: subj.section,
    });
    setEditingId(subj._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/subjects/${id}`);
      fetchSubjects();
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      alert('Error deleting subject');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', teacher: '', className: selectedClass, section: 'A' });
    setEditingId(null);
    setShowForm(false);
  };

  const filtered = subjects.filter(s => s.className?.trim() === selectedClass);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/teacher')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold">Subject Management</h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" /> Add Subject
          </Button>
        </div>

        <Card className="mb-6">
          <CardContent>
            <label className="text-sm font-medium mr-2">Class:</label>
            <Select value={selectedClass} onValueChange={(v) => {
              setSelectedClass(v);
              setFormData(prev => ({ ...prev, className: v }));
            }}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map(cls => <SelectItem key={cls} value={cls}>{cls}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Subject' : 'Add New Subject'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Subject Name</label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Teacher</label>
                  <Input
                    value={formData.teacher}
                    onChange={e => setFormData({ ...formData, teacher: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Class</label>
                  <Select
                    value={formData.className}
                    onValueChange={val => setFormData({ ...formData, className: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map(cls => <SelectItem key={cls} value={cls}>{cls}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm mb-2">Section</label>
                  <Select
                    value={formData.section}
                    onValueChange={val => setFormData({ ...formData, section: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionOptions.map(sec => <SelectItem key={sec} value={sec}>{sec}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 flex space-x-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingId ? 'Update' : 'Add'} Subject
                  </Button>
                  <Button variant="outline" onClick={resetForm}>Cancel</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Subjects for Class {selectedClass}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map(subj => (
                    <TableRow key={subj._id}>
                      <TableCell>{subj.name}</TableCell>
                      <TableCell>{subj.teacher}</TableCell>
                      <TableCell>{subj.className}</TableCell>
                      <TableCell>{subj.section}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(subj)}>
                          <Pencil className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(subj._id)}>
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No subjects for this class.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subjects;
