import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin, Phone, Edit, Users, Download, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import AddBusStudentModal from '@/components/AddBusStudentModal';

const Bus = () => {
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<'driver' | 'student'>('driver');
  const [formData, setFormData] = useState({
    driverName: '',
    phoneNumber: '',
    vehicleNumber: '',
    studentName: '',
    pickupPoint: ''
  });

  const [busData, setBusData] = useState([
    {
      id: 1,
      studentId: 'S001',
      studentName: 'Alice Johnson',
      class: '10A',
      routeId: 'R001',
      routeName: 'Route 1: Main Street - School',
      pickupPoint: 'Main Street Stop 1',
      driverName: 'John Smith',
      phoneNumber: '9876543210',
      vehicleNumber: 'TN-01-AB-1234'
    },
    {
      id: 2,
      studentId: 'S002',
      studentName: 'Bob Smith',
      class: '9B',
      routeId: 'R001',
      routeName: 'Route 1: Main Street - School',
      pickupPoint: 'Main Street Stop 2',
      driverName: 'John Smith',
      phoneNumber: '9876543210',
      vehicleNumber: 'TN-01-AB-1234'
    },
    {
      id: 3,
      studentId: 'S003',
      studentName: 'Carol Davis',
      class: '10B',
      routeId: 'R002',
      routeName: 'Route 2: Park Avenue - School',
      pickupPoint: 'Park Avenue Stop 1',
      driverName: 'Mike Johnson',
      phoneNumber: '9876543211',
      vehicleNumber: 'TN-01-CD-5678'
    }
  ]);

  const students = [
    { id: 'S001', name: 'Alice Johnson', class: '10A' },
    { id: 'S002', name: 'Bob Smith', class: '9B' },
    { id: 'S003', name: 'Carol Davis', class: '10B' },
    { id: 'S004', name: 'David Wilson', class: '9A' },
    { id: 'S005', name: 'Emma Brown', class: '10A' }
  ];

  const classes = ['9A', '9B', '10A', '10B', '10C'];
  const routes = ['R001', 'R002', 'R003'];

  const getFilteredData = () => {
    return busData.filter(item => {
      const studentMatch = selectedStudent === 'all' || item.studentId === selectedStudent;
      const classMatch = selectedClass === 'all' || item.class === selectedClass;
      const routeMatch = selectedRoute === 'all' || item.routeId === selectedRoute;
      return studentMatch && classMatch && routeMatch;
    });
  };

  const filteredData = getFilteredData();

  const handleEdit = (item: any, type: 'driver' | 'student') => {
    setEditingItem(item);
    setEditType(type);
    setFormData({
      driverName: type === 'driver' ? item.driverName : '',
      phoneNumber: type === 'driver' ? item.phoneNumber : '',
      vehicleNumber: type === 'driver' ? item.vehicleNumber : '',
      studentName: type === 'student' ? item.studentName : '',
      pickupPoint: type === 'student' ? item.pickupPoint : ''
    });
    setShowEditModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated data:', formData);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleAddStudent = (student: any) => {
    console.log('Adding student:', student);
  };

  const handleDelete = (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
    if (confirmDelete) {
      const updated = busData.filter(item => item.id !== id);
      setBusData(updated);
    }
  };

  const exportData = () => {
    const exportData = filteredData.map(item => ({
      'Student Name': item.studentName,
      'Class': item.class,
      'Route ID': item.routeId,
      'Route Name': item.routeName,
      'Pickup Point': item.pickupPoint,
      'Driver Name': item.driverName,
      'Phone Number': item.phoneNumber,
      'Vehicle Number': item.vehicleNumber
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bus Tracking Data');
    XLSX.writeFile(wb, 'bus_tracking_data.xlsx');
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Bus Tracking</h1>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddStudentModal(true)} variant="default">
              <Users className="w-4 h-4 mr-2" />
              Add Student
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label>Select Student</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger>
                <SelectValue placeholder="Select Student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students.map(student => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} ({student.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Select Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(cls => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Select Route</Label>
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger>
                <SelectValue placeholder="Select Route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {routes.map(route => (
                  <SelectItem key={route} value={route}>{route}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Total Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{filteredData.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Active Routes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{new Set(filteredData.map(item => item.routeId)).size}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-600">Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{new Set(filteredData.map(item => item.studentId)).size}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Bus Tracking Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Pickup Point</TableHead>
                    <TableHead>Driver Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No data found. Please select filters above to view results.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.studentName}</TableCell>
                        <TableCell>{item.class}</TableCell>
                        <TableCell><div className="flex items-center"><MapPin className="w-4 h-4 mr-2" />{item.routeName}</div></TableCell>
                        <TableCell>{item.pickupPoint}</TableCell>
                        <TableCell>{item.driverName}</TableCell>
                        <TableCell><div className="flex items-center"><Phone className="w-4 h-4 mr-2" />{item.phoneNumber}</div></TableCell>
                        <TableCell>{item.vehicleNumber}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(item, 'driver')}>
                              <Edit className="w-4 h-4 mr-1" />
                              Edit Driver
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit {editType === 'driver' ? 'Driver' : 'Student'} Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {editType === 'driver' ? (
                <>
                  <div>
                    <Label>Driver Name *</Label>
                    <Input
                      value={formData.driverName}
                      onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Phone Number *</Label>
                    <Input
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <div>
                    <Label>Vehicle Number *</Label>
                    <Input
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                      required
                    />
                  </div>
                </>
              ) : null}
              <div className="flex space-x-2">
                <Button type="submit" className="flex-1">Update</Button>
                <Button type="button" variant="outline" onClick={() => setShowEditModal(false)} className="flex-1">Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <AddBusStudentModal
          isOpen={showAddStudentModal}
          onClose={() => setShowAddStudentModal(false)}
          onAddStudent={handleAddStudent}
          routes={routes}
        />
      </div>
    </div>
  );
};

export default Bus;