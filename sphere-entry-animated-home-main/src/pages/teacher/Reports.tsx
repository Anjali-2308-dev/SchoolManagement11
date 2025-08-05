import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';

const subjectFields = [
  'math',
  'english',
  'science',
  'socialStudies',
  'computer',
  'hindi',
];

const Reports = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('10A');
  const [students, setStudents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editMarks, setEditMarks] = useState({
    math: 0,
    english: 0,
    science: 0,
    socialStudies: 0,
    computer: 0,
    hindi: 0,
  });

  const [newStudent, setNewStudent] = useState({
    name: '',
    rollNo: '',
    math: 0,
    english: 0,
    science: 0,
    socialStudies: 0,
    computer: 0,
    hindi: 0,
  });

  const calculateGrade = (marks) => {
    const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
    if (avg >= 90) return 'A+';
    if (avg >= 80) return 'A';
    if (avg >= 70) return 'B+';
    if (avg >= 60) return 'B+';
    if (avg >= 50) return 'B';
    if (avg >= 40) return 'C';
    if (avg >= 35) return 'D';
    return 'F';
  };

  const fetchStudents = async (className) => {
    try {
      const res = await axios.get(`http://localhost:5000/grades/${className}`);
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students', err);
    }
  };

  useEffect(() => {
    fetchStudents(selectedClass);
  }, [selectedClass]);

  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditMarks({
      math: student.math || 0,
      english: student.english || 0,
      science: student.science || 0,
      socialStudies: student.socialStudies || 0,
      computer: student.computer || 0,
      hindi: student.hindi || 0,
    });
    setShowEditModal(true);
  };

  const handleUpdateMarks = async () => {
    try {
      const marks = subjectFields.map((field) => Number(editMarks[field]) || 0);
      const totalMarks = marks.reduce((a, b) => a + b, 0);
      const average = Math.round(totalMarks / marks.length);
      const grade = calculateGrade(marks);

      await axios.put(`http://localhost:5000/grades/${editingStudent._id}`, {
        ...editMarks,
        totalMarks,
        average,
        grade,
        class: selectedClass,
      });
      setShowEditModal(false);
      fetchStudents(selectedClass); // Refetch after update
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleAddStudent = async () => {
    const { name, rollNo } = newStudent;

    if (!name || !rollNo) {
      alert("Please enter student's name and roll number.");
      return;
    }

    // Calculate marks, total, average, and grade
    const marks = subjectFields.map((field) => Number(newStudent[field]) || 0);
    const totalMarks = marks.reduce((a, b) => a + b, 0);
    const average = Math.round(totalMarks / marks.length);
    const grade = calculateGrade(marks);

    const formattedStudent = {
      ...newStudent,
      math: Number(newStudent.math) || 0,
      english: Number(newStudent.english) || 0,
      science: Number(newStudent.science) || 0,
      socialStudies: Number(newStudent.socialStudies) || 0,
      computer: Number(newStudent.computer) || 0,
      hindi: Number(newStudent.hindi) || 0,
      totalMarks,
      average,
      grade,
      class: selectedClass,
    };

    try {
      await axios.post('http://localhost:5000/grades', formattedStudent);
      setShowAddModal(false);
      setNewStudent({
        name: '',
        rollNo: '',
        math: 0,
        english: 0,
        science: 0,
        socialStudies: 0,
        computer: 0,
        hindi: 0,
      });
      fetchStudents(selectedClass);
    } catch (err) {
      console.error('Failed to add student', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/grades/${id}`);
      fetchStudents(selectedClass); // Refetch after delete
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Academic Reports</h1>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddModal(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Class Selection */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Label>Select Class:</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Class" />
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
          </CardContent>
        </Card>

        {/* Student Table */}
        <Card>
          <CardHeader>
            <CardTitle>Class {selectedClass} - Academic Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    {subjectFields.map((subject) => (
                      <TableHead key={subject}>{subject.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</TableHead>
                    ))}
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const marks = subjectFields.map((field) => Number(student[field]) || 0);
                    const totalMarks = student.totalMarks ?? marks.reduce((a, b) => a + b, 0);
                    const average = Math.round(totalMarks / marks.length);
                    return (
                      <TableRow key={student._id}>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        {subjectFields.map((subject) => (
                          <TableCell key={subject}>{student[subject]}</TableCell>
                        ))}
                        <TableCell>{totalMarks}</TableCell>
                        <TableCell>{average}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-sm font-medium ${
                            student.grade === 'A+' ? 'bg-green-100 text-green-800' :
                            student.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                            student.grade === 'B+' ? 'bg-yellow-100 text-yellow-800' :
                            student.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                            student.grade === 'C' ? 'bg-orange-100 text-orange-800' :
                            student.grade === 'D' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {student.grade}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(student._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Marks - {editingStudent?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {subjectFields.map((subject) => (
                <div key={subject}>
                  <Label>{subject.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editMarks[subject]}
                    onChange={(e) => setEditMarks({ ...editMarks, [subject]: parseInt(e.target.value) || 0 })}
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <Button onClick={handleUpdateMarks} className="flex-1">Update</Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Dialog */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent style={{ maxHeight: '80vh', overflowY: 'auto', padding: '1.5rem' }}>
            <DialogHeader>
              <DialogTitle>Add Student - Class {selectedClass}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} />
              </div>
              <div>
                <Label>Roll No</Label>
                <Input value={newStudent.rollNo} onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjectFields.map((subject) => (
                  <div key={subject}>
                    <Label>{subject.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newStudent[subject]}
                      onChange={(e) => setNewStudent({ ...newStudent, [subject]: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={handleAddStudent} className="flex-1">Add</Button>
                <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Reports;