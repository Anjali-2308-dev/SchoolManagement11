import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';

const classOptions = ['10A', '10B', '10C', '9A', '9B'];
const sectionOptions = ['A', 'B', 'C'];

const Subjects = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('10A');
  const [subjects, setSubjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', teacher: '', className: '10A', section: 'A' });

  useEffect(() => {
    fetchSubjects();
  }, [selectedClass]);

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/subjects', { params: { className: selectedClass } });
      setSubjects(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('Failed to fetch subjects.');
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

    if (!payload.name || !payload.teacher) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/subjects/${editingId}`, payload);
        toast.success('Subject updated successfully');
      } else {
        await axios.post('http://localhost:5000/subjects', payload);
        toast.success('Subject added successfully');
      }
      resetForm();
      fetchSubjects();
    } catch (err) {
      console.error('Save error:', err.response?.data || err.message);
      toast.error('Failed to save subject');
    }
  };

  const handleEdit = (subj) => {
    setFormData({ name: subj.name, teacher: subj.teacher, className: subj.className, section: subj.section });
    setEditingId(subj._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/subjects/${id}`);
      toast.success('Subject deleted successfully');
      fetchSubjects();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete subject');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', teacher: '', className: selectedClass, section: 'A' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredSubjects = subjects.filter((s) => s.className === selectedClass);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/teacher')} className="h-8 sm:h-10 px-2 sm:px-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">Subject Management</h1>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 flex items-center gap-x-2 h-8 sm:h-10 px-2 sm:px-4"
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </Button>
        </div>

        {/* Class Select */}
        <Card>
          <CardContent className="flex items-center gap-2 pt-6">
            <span className="text-sm font-medium">Select Class:</span>
            <Select
              value={selectedClass}
              onValueChange={(value) => {
                setSelectedClass(value);
                setFormData((prev) => ({ ...prev, className: value }));
              }}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classOptions.map((cls) => (
                  <SelectItem key={cls} value={cls}>
                    {cls}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Form Section */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Subject' : 'Add New Subject'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Subject Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Teacher</label>
                  <Input
                    value={formData.teacher}
                    onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Class</label>
                  <Select
                    value={formData.className}
                    onValueChange={(value) => setFormData({ ...formData, className: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((cls) => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Section</label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) => setFormData({ ...formData, section: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Section" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectionOptions.map((sec) => (
                        <SelectItem key={sec} value={sec}>
                          {sec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingId ? 'Update' : 'Add'} Subject
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Subjects Table */}
        <Card>
          <CardHeader>
            <CardTitle>Subjects for Class {selectedClass}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Section</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.length ? (
                    filteredSubjects.map((subj) => (
                      <TableRow key={subj._id}>
                        <TableCell>{subj.name}</TableCell>
                        <TableCell>{subj.teacher}</TableCell>
                        <TableCell>{subj.className}</TableCell>
                        <TableCell>{subj.section}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(subj)}>
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(subj._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Subjects;
