import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, Plus, Edit, Trash2 } from 'lucide-react';
import EditPayrollModal from '@/components/EditPayrollModal';
import * as XLSX from 'xlsx';
import axios from 'axios';

const Payroll = () => {
  const navigate = useNavigate();
  const [payrollData, setPayrollData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '', position: '', department: '',
    baseSalary: 0, allowances: 0, deductions: 0,
    status: 'Pending'
  });

  useEffect(() => {
    fetchPayroll();
  }, []);

  const fetchPayroll = async () => {
    try {
      const res = await axios.get('http://localhost:5000/payroll');
      setPayrollData(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleEdit = emp => {
    setEditingEmployee(emp);
    setShowEditModal(true);
  };

  const handleDelete = async id => {
    // optional confirmation
    try {
      await axios.delete(`http://localhost:5000/payroll/${id}`);
      setPayrollData(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleUpdateEmployee = async updated => {
    const netSalary = updated.baseSalary + updated.allowances - updated.deductions;
    try {
      const res = await axios.put(`http://localhost:5000/payroll/${updated._id}`, { ...updated, netSalary });
      setPayrollData(prev => prev.map(p => p._id === updated._id ? res.data : p));
      setShowEditModal(false);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    const emp = payrollData.find(p => p._id === id);
    if (!emp) return;
    try {
      const res = await axios.put(`http://localhost:5000/payroll/${id}`, { ...emp, status: newStatus });
      setPayrollData(prev => prev.map(p => p._id === id ? res.data : p));
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  const exportPayrollData = () => {
    const data = payrollData.map(emp => ({
      Name: emp.name,
      Designation: emp.position,
      Department: emp.department,
      'Base Salary': emp.baseSalary,
      Allowances: emp.allowances,
      Deductions: emp.deductions,
      'Net Salary': emp.netSalary,
      Status: emp.status
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payroll');
    XLSX.writeFile(wb, 'payroll.xlsx');
  };

  const handleAddNew = async () => {
    const netSalary = newEmployee.baseSalary + newEmployee.allowances - newEmployee.deductions;
    const payload = { ...newEmployee, netSalary };
    try {
      const res = await axios.post('http://localhost:5000/payroll', payload);
      setPayrollData(prev => [res.data, ...prev]);
      setShowAddForm(false);
      setNewEmployee({ name: '', position: '', department: '', baseSalary: 0, allowances: 0, deductions: 0, status: 'Pending' });
    } catch (err) {
      console.error('Add error:', err);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-yellow-50 to-amber-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button onClick={() => navigate('/dashboard/principal')} variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">HR / Payroll</h1>
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-1" /> Add Staff
            </Button>
            <Button onClick={exportPayrollData} className="bg-yellow-600 text-white">
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
          </div>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader><CardTitle>Add Payroll Entry</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['name','position','department'].map(f => (
                  <div key={f}>
                    <label className="mb-1 capitalize">{f}</label>
                    <input value={newEmployee[f]} onChange={e => setNewEmployee({...newEmployee,[f]: e.target.value})}
                      className="border p-2 w-full" placeholder={f} required />
                  </div>
                ))}
                {['baseSalary','allowances','deductions'].map(f => (
                  <div key={f}>
                    <label className="mb-1 capitalize">{f}</label>
                    <input type="number" value={newEmployee[f]} onChange={e => setNewEmployee({...newEmployee,[f]: +e.target.value})}
                      className="border p-2 w-full" required />
                  </div>
                ))}
                <div>
                  <label>Net Salary</label>
                  <input readOnly value={newEmployee.baseSalary + newEmployee.allowances - newEmployee.deductions}
                    className="border p-2 w-full bg-gray-100" />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleAddNew} className="bg-blue-600 text-white">Add</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Table */}
        <Card>
          <CardHeader><CardTitle>Payroll Entries</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {['Name','Position','Department','Base Salary','Allowances','Deductions','Net Salary','Status','Actions'].map(h => (
                      <th key={h} className="py-2 text-left">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map(emp => (
                    <tr key={emp._id} className="border-b">
                      <td className="py-2 font-medium">{emp.name}</td>
                      <td className="py-2">{emp.position}</td>
                      <td className="py-2">{emp.department}</td>
                      <td className="py-2">${emp.baseSalary?.toLocaleString()}</td>
                      <td className="py-2">${emp.allowances?.toLocaleString()}</td>
                      <td className="py-2">${emp.deductions?.toLocaleString()}</td>
                      <td className="py-2 font-medium">${emp.netSalary?.toLocaleString()}</td>
                      <td className="py-2">
                        <Select value={emp.status} onValueChange={val => handleStatusUpdate(emp._id, val)}>
                          <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Paid">Paid</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="On Hold">On Hold</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="py-2 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(emp)}>
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(emp._id)}>
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <EditPayrollModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          employee={editingEmployee}
          onUpdateEmployee={handleUpdateEmployee}
        />
      </div>
    </div>
  );
};

export default Payroll;
