import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, User, Search, Plus } from 'lucide-react';
import AddStaffModal from '@/components/AddStaffModal';
import * as XLSX from 'xlsx';
import axios from 'axios';

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  subjects: string[];
  classes: string[];
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

const StaffManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [staffData, setStaffData] = useState<Staff[]>([]);

  useEffect(() => {
    fetchStaffData();
  }, []);

  const fetchStaffData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/AddStaff');
      setStaffData(res.data);
    } catch (error) {
      console.error('Failed to fetch staff data:', error);
    }
  };

  const handleAddStaff = async (newStaff: Staff) => {
    try {
      await axios.post('http://localhost:5000/AddStaff', newStaff);
      fetchStaffData();
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const filteredStaff = staffData.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportStaffList = () => {
    const exportData = staffData.map(staff => ({
      Name: staff.name,
      Role: staff.role,
      Department: staff.subjects.join(', '),
      Classes: staff.classes.join(', '),
      'Join Date': staff.joinDate,
      Email: staff.email,
      Phone: staff.phone,
      Status: staff.status,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff List');
    XLSX.writeFile(wb, 'staff_management.xlsx');
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/principal')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Staff
            </Button>
            <Button onClick={exportStaffList} className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Export List
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search staff by name, role, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Staff Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Staff</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffData.length}</div>
              <p className="text-xs text-muted-foreground">Active members</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Teachers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {staffData.filter(s => s.role.toLowerCase().includes('teacher')).length}
              </div>
              <p className="text-xs text-muted-foreground">Teaching staff</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">On Leave</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {staffData.filter(s => s.status === 'On Leave').length}
              </div>
              <p className="text-xs text-muted-foreground">Currently absent</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">New Hires</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>
        </div>

        {/* Staff Directory Table */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3">Name</th>
                    <th className="text-left py-3">Role</th>
                    <th className="text-left py-3">Subjects</th>
                    <th className="text-left py-3">Classes</th>
                    <th className="text-left py-3">Join Date</th>
                    <th className="text-left py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((staff) => (
                    <tr key={staff.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <div className="font-medium">{staff.name}</div>
                          <div className="text-sm text-gray-500">{staff.email}</div>
                        </div>
                      </td>
                      <td className="py-3">{staff.role}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {staff.subjects.map((subject, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-1">
                          {staff.classes.map((cls, index) => (
                            <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              {cls}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3">{staff.joinDate}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          staff.status === 'Active' ? 'bg-green-100 text-green-800' :
                          staff.status === 'On Leave' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <AddStaffModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddStaff={handleAddStaff}
        />
      </div>
    </div>
  );
};

export default StaffManagement;
