import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, Search, Calendar, Plus, Save } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import AddStudentModal from '@/components/AddStudentModal';

const Attendance = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('10A');
  const [showAddModal, setShowAddModal] = useState(false);
  const [students, setStudents] = useState([]);

  // Always fetch students when class or date changes, or after adding a student
  const fetchStudents = async (cls, date) => {
    try {
      const res = await axios.get('http://localhost:5000/students-with-attendance', {
        params: { class: cls, date },
      });
      setStudents(res.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setStudents([]); // Clear students on error
    }
  };

  // Fetch students on mount and whenever class/date changes
  useEffect(() => {
    fetchStudents(selectedClass, selectedDate);
  }, [selectedClass, selectedDate]);

  const handleAttendanceChange = async (studentId, present) => {
    setStudents((prev) =>
      prev.map((student) =>
        student._id === studentId ? { ...student, present } : student
      )
    );

    try {
      await axios.put(`http://localhost:5000/attendance/${studentId}`, {
        present,
        date: selectedDate,
      });
    } catch (err) {
      console.error('Error updating attendance:', err);
      alert('Failed to update attendance in DB.');
    }
  };

  const handleAddStudent = async (newStudent) => {
    try {
      await axios.post('http://localhost:5000/attendance', {
        ...newStudent,
        date: selectedDate,
      });
      // Refetch students after adding
      fetchStudents(selectedClass, selectedDate);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student');
    }
  };

  const exportToCSV = () => {
    const csvData = students
      .filter((student) => student.class === selectedClass)
      .map((student) => ({
        'Roll No': student.rollNo,
        Name: student.name,
        Class: student.class,
        Status: student.present ? 'Present' : 'Absent',
        Date: selectedDate,
      }));
    console.log('Exporting CSV:', csvData);
    // Use a library like PapaParse or file-saver for actual export
  };

  const saveAttendance = async () => {
    try {
      const payload = students
        .filter((student) => student.class === selectedClass)
        .map((student) => ({
          studentId: student._id,
          date: selectedDate,
          present: student.present,
        }));

      const res = await axios.post('http://localhost:5000/attendance/:', payload);
      console.log('Saved attendance:', res.data);
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Failed to save attendance.');
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNo.includes(searchTerm)) &&
      student.class === selectedClass
  );

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Attendance Management</h1>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Add Student
            </Button>
            <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
            <Button onClick={saveAttendance} className="bg-indigo-600 hover:bg-indigo-700">
              <Save className="w-4 h-4 mr-2" /> Save Attendance
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Attendance Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Search Students</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium mb-2">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10A">10A</SelectItem>
                    <SelectItem value="10B">10B</SelectItem>
                    <SelectItem value="10C">10C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Class {selectedClass} - {selectedDate}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Absent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No students found for class {selectedClass}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student._id}>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={student.present}
                            onCheckedChange={(checked) => handleAttendanceChange(student._id, !!checked)}
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Checkbox
                            checked={!student.present}
                            onCheckedChange={(checked) => handleAttendanceChange(student._id, !checked)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Total Students: {filteredStudents.length}</span>
                <span>Present: {filteredStudents.filter((s) => s.present).length}</span>
                <span>Absent: {filteredStudents.filter((s) => !s.present).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <AddStudentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddStudent={handleAddStudent}
        />
      </div>
    </div>
  );
};

export default Attendance;