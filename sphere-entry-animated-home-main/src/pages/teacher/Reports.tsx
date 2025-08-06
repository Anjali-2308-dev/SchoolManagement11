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
    math: 0, english: 0, science: 0, socialStudies: 0, computer: 0, hindi: 0,
  });
  const [newStudent, setNewStudent] = useState({
    name: '', rollNo: '', math: 0, english: 0, science: 0, socialStudies: 0, computer: 0, hindi: 0,
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
        ...editMarks, totalMarks, average, grade, class: selectedClass,
      });
      setShowEditModal(false);
      fetchStudents(selectedClass);
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

    const marks = subjectFields.map((field) => Number(newStudent[field]) || 0);
    const totalMarks = marks.reduce((a, b) => a + b, 0);
    const average = Math.round(totalMarks / marks.length);
    const grade = calculateGrade(marks);

    const formattedStudent = { ...newStudent, totalMarks, average, grade, class: selectedClass };

    try {
      await axios.post('http://localhost:5000/grades', formattedStudent);
      setShowAddModal(false);
      setNewStudent({ name: '', rollNo: '', math: 0, english: 0, science: 0, socialStudies: 0, computer: 0, hindi: 0 });
      fetchStudents(selectedClass);
    } catch (err) {
      console.error('Failed to add student', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/grades/${id}`);
      fetchStudents(selectedClass);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button
              onClick={() => navigate('/dashboard/teacher')}
              variant="outline"
              size="sm"
              className="flex items-center gap-x-1 px-2 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 text-sm sm:text-base w-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Academic Reports</h1>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-x-1 px-2 sm:px-4 py-1 sm:py-2 h-8 sm:h-10 text-sm sm:text-base w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
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
              <Table className="min-w-[900px] sm:min-w-full">
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
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      {subjectFields.map((subject) => (
                        <TableCell key={subject}>{student[subject]}</TableCell>
                      ))}
                      <TableCell>{student.totalMarks}</TableCell>
                      <TableCell>{student.average}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          student.grade === 'A+' ? 'bg-green-100 text-green-800' :
                          student.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                          student.grade === 'B+' ? 'bg-yellow-100 text-yellow-800' :
                          student.grade === 'B' ? 'bg-yellow-100 text-yellow-800' :
                          student.grade === 'C' ? 'bg-orange-100 text-orange-800' :
                          student.grade === 'D' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>{student.grade}</span>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit & Add Dialogs (unchanged, they’re already responsive) */}
        {/* (Keep the dialogs as you already wrote, no change needed) */}
        {/* ... Dialog components here ... */}
      </div>
    </div>
  );
};

export default Reports;
