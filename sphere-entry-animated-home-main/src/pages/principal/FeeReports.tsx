import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, DollarSign, Users, GraduationCap, Edit, Plus, Trash } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import EditFeeModal from '@/components/EditFeeModal';
import axios from 'axios';

const FeeReports = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('student');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [studentWiseData, setStudentWiseData] = useState<any[]>([]);
  const [classWiseData, setClassWiseData] = useState<any[]>([]);

  useEffect(() => {
    if (filterType === 'student') {
      fetchStudentWiseFees();
    } else {
      fetchClassWiseFees();
    }
  }, [filterType]);

  // Fetch all student fee records
  const fetchStudentWiseFees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/fee/student');
      setStudentWiseData(res.data);
    } catch (error) {
      console.error('Error fetching student-wise fees:', error);
    }
  };

  // Fetch aggregated class-wise fee data
  const fetchClassWiseFees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/fee/class');
      setClassWiseData(res.data);
    } catch (error) {
      console.error('Error fetching class-wise fees:', error);
    }
  };

  // Update student fee record
  const handleUpdateRecord = async (updatedRecord: any) => {
    try {
      await axios.put(`http://localhost:5000/fee/${updatedRecord.id}`, updatedRecord);
      fetchStudentWiseFees();
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  // Add new student fee record
  const handleAddRecord = async (newRecord: any) => {
    try {
      // Remove ₹ or commas if present in amount
      newRecord.amount = newRecord.amount.replace(/[₹,]/g, '');
      await axios.post('http://localhost:5000/fee', newRecord);
      fetchStudentWiseFees();
    } catch (error) {
      console.error('Error adding record:', error);
    }
  };

  // Delete a student fee record
  const handleDeleteStudent = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/fee/${id}`);
      fetchStudentWiseFees();
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };

  // Delete all fees of a class and refresh
  const handleDeleteClass = async (className: string) => {
    try {
      await axios.delete(`http://localhost:5000/fee/class/${className}`);
      fetchClassWiseFees();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleEdit = (record: any) => {
    setEditingRecord(record);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen p-4 relative">
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/principal')} variant="outline" size="sm" className="bg-white/70 hover:bg-white/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-red-100">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Fee Reports</h1>
                <p className="text-gray-600">Financial collections & payment tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons & Add Student Button */}
        <div className="flex space-x-4 mb-6 items-center">
          <Button onClick={() => setFilterType('student')} variant={filterType === 'student' ? 'default' : 'outline'} className="bg-gray-700 hover:bg-gray-600">
            <Users className="w-4 h-4 mr-2" />
            Student-wise
          </Button>
          <Button onClick={() => setFilterType('class')} variant={filterType === 'class' ? 'default' : 'outline'} className="bg-white/70 hover:bg-white/90">
            <GraduationCap className="w-4 h-4 mr-2" />
            Class-wise
          </Button>
          {filterType === 'student' && (
            <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white ml-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Student
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[ 
            { label: 'Total Collected', color: 'text-green-600', value: '₹2,45,000' }, 
            { label: 'Pending Amount', color: 'text-yellow-600', value: '₹41,000' }, 
            { label: 'Overdue', color: 'text-red-600', value: '₹15,000' }, 
            { label: 'Collection Rate', color: 'text-blue-600', value: '85.7%' }
          ].map(stat => (
            <Card key={stat.label} className="bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Table */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{filterType === 'student' ? 'Student-wise Fee Report' : 'Class-wise Fee Report'}</CardTitle>
          </CardHeader>
          <CardContent>
            {filterType === 'student' ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentWiseData.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>{student.id}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>{student.amount}</TableCell>
                      <TableCell>{student.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          student.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          student.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                          {student.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(student)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteStudent(student.id)}>
                          <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead>Collected</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Collection %</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classWiseData.map(classData => (
                    <TableRow key={classData.class}>
                      <TableCell className="font-medium">{classData.class}</TableCell>
                      <TableCell>{classData.totalStudents}</TableCell>
                      <TableCell className="text-green-600">{classData.collected}</TableCell>
                      <TableCell className="text-red-600">{classData.pending}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          parseFloat(classData.percentage) >= 90 ? 'bg-green-100 text-green-800' :
                          parseFloat(classData.percentage) >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}>
                          {classData.percentage}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteClass(classData.class)}>
                          <Trash className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <EditFeeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          record={editingRecord}
          onUpdateRecord={handleUpdateRecord}
        />

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Add New Student Fee Record</h2>
              <form
                onSubmit={(e: any) => {
                  e.preventDefault();
                  const newRecord = {
                    id: e.target.id.value.trim(),
                    name: e.target.name.value.trim(),
                    class: e.target.class.value.trim(),
                    amount: e.target.amount.value.trim(),
                    status: e.target.status.value,
                    date: e.target.date.value,
                    remarks: e.target.remarks.value
                  };
                  handleAddRecord(newRecord);
                  setShowAddModal(false);
                }}
                className="space-y-4"
              >
                <input name="id" placeholder="Student ID" required className="w-full border px-3 py-2 rounded" />
                <input name="name" placeholder="Student Name" required className="w-full border px-3 py-2 rounded" />
                <input name="class" placeholder="Class" required className="w-full border px-3 py-2 rounded" />
                <input name="amount" placeholder="Amount (e.g., 12000)" required className="w-full border px-3 py-2 rounded" />
                <input name="date" placeholder="Payment Date" required className="w-full border px-3 py-2 rounded" />
                <select name="status" className="w-full border px-3 py-2 rounded" required>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
                <input name="remarks" placeholder="Remarks" className="w-full border px-3 py-2 rounded" />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                  <Button type="submit">Add</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeReports;
