import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Download, Users, Calendar as CalendarIcon, TrendingUp, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, subWeeks, subMonths, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import axios from 'axios';

interface Student {
  _id: string;
  name: string;
  rollNo: string;
  class: string;
  present?: boolean;
}

interface ClassAttendance {
  class: string;
  total: number;
  present: number;
  percentage: number;
}

const AttendanceAnalytics = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [exportType, setExportType] = useState<string>('');
  const [viewType, setViewType] = useState<string>('weekly');
  const [students, setStudents] = useState<Student[]>([]);
  const [classList, setClassList] = useState<string[]>(['Class 1', 'Class 2', 'Class 3']);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [classAttendance, setClassAttendance] = useState<ClassAttendance[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalStats, setTotalStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    avgAttendance: 0
  });

  // Mock data for initial render
  const mockStudents: Student[] = [
    { _id: '1', name: 'John Doe', rollNo: 'S001', class: 'Class 1', present: true },
    { _id: '2', name: 'Jane Smith', rollNo: 'S002', class: 'Class 1', present: false },
    { _id: '3', name: 'Mike Johnson', rollNo: 'S003', class: 'Class 2', present: true },
    { _id: '4', name: 'Sarah Williams', rollNo: 'S004', class: 'Class 2', present: true },
    { _id: '5', name: 'David Brown', rollNo: 'S005', class: 'Class 3', present: false },
  ];

  // Fetch classes and students
  useEffect(() => {
    const fetchClassesAndStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API first
        const studentsRes = await axios.get('/students-with-attendance', {
          params: {
            date: format(selectedDate, 'yyyy-MM-dd'),
            class: selectedClass === 'all' ? undefined : selectedClass
          }
        });
        
        const studentsData = studentsRes.data || mockStudents;
        setStudents(studentsData);
        
        // Extract unique classes
        const classes = [...new Set(studentsData.map((s: Student) => s.class))];
        setClassList(classes.length > 0 ? classes : ['Class 1', 'Class 2', 'Class 3']);
        
        // Calculate initial stats
        calculateStats(studentsData);
        
        // Fetch attendance data for charts
        fetchAttendanceData();
      } catch (error) {
        console.error('Error fetching data, using mock data instead:', error);
        setError('Failed to fetch data. Showing sample data.');
        setStudents(mockStudents);
        calculateStats(mockStudents);
        fetchAttendanceData();
      } finally {
        setLoading(false);
      }
    };
    
    fetchClassesAndStudents();
  }, [selectedClass, selectedDate]);

  // Fetch attendance data for charts based on view type
  const fetchAttendanceData = () => {
    try {
      let dateRange: Date[] = [];
      const now = new Date();
      
      switch (viewType) {
        case 'daily':
          dateRange = eachDayOfInterval({
            start: subDays(now, 7),
            end: now
          });
          break;
        case 'weekly':
          dateRange = eachWeekOfInterval({
            start: subMonths(now, 1),
            end: now
          });
          break;
        case 'monthly':
          dateRange = eachMonthOfInterval({
            start: subMonths(now, 6),
            end: now
          });
          break;
      }
      
      const mockData = generateMockAttendanceData(dateRange, viewType);
      setAttendanceData(mockData);
      
      generateClassAttendanceData();
    } catch (error) {
      console.error('Error generating attendance data:', error);
      setError('Failed to generate chart data.');
    }
  };

  // Generate mock attendance data
  const generateMockAttendanceData = (dates: Date[], type: string) => {
    return dates.map((date) => {
      const basePresent = Math.floor(Math.random() * 40) + 10;
      const baseAbsent = Math.floor(Math.random() * 5) + 1;
      
      if (type === 'daily') {
        return {
          period: format(date, 'MMM dd'),
          present: basePresent,
          absent: baseAbsent
        };
      } else if (type === 'weekly') {
        return {
          period: format(date, 'MMM dd'),
          present: basePresent * 5,
          absent: baseAbsent * 5
        };
      } else {
        return {
          period: format(date, 'MMM yyyy'),
          present: basePresent * 20,
          absent: baseAbsent * 20
        };
      }
    });
  };

  // Generate class attendance data
  const generateClassAttendanceData = () => {
    const classData: ClassAttendance[] = classList.map(cls => {
      const classStudents = students.filter(s => s.class === cls);
      const presentCount = classStudents.filter(s => s.present).length;
      const total = classStudents.length || 1; // Avoid division by zero
      const percentage = (presentCount / total) * 100;
      
      return {
        class: cls,
        total,
        present: presentCount,
        percentage: parseFloat(percentage.toFixed(1))
      };
    });
    
    setClassAttendance(classData);
  };

  // Calculate statistics
  const calculateStats = (studentsData: Student[]) => {
    const presentCount = studentsData.filter(s => s.present).length;
    const total = studentsData.length || 1; // Avoid division by zero
    const absentCount = total - presentCount;
    const attendancePercentage = (presentCount / total) * 100;
    
    setTotalStats({
      totalStudents: total,
      presentToday: presentCount,
      absentToday: absentCount,
      avgAttendance: parseFloat(attendancePercentage.toFixed(1))
    });
  };

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Export report to Excel
  const exportReport = () => {
    if (exportType) {
      let exportData = [];
      
      switch (exportType) {
        case 'daily':
          exportData = students.map(student => ({
            'Student Name': student.name,
            'Student ID': student.rollNo,
            'Class': student.class,
            'Date': format(selectedDate, 'yyyy-MM-dd'),
            'Status': student.present ? 'Present' : 'Absent'
          }));
          break;
        case 'weekly':
          exportData = students.map(student => ({
            'Student Name': student.name,
            'Student ID': student.rollNo,
            'Class': student.class,
            'Week': format(selectedDate, 'yyyy-[W]ww'),
            'Days Present': Math.floor(Math.random() * 5) + 1,
            'Days Absent': Math.floor(Math.random() * 2)
          }));
          break;
        case 'monthly':
          exportData = students.map(student => ({
            'Student Name': student.name,
            'Student ID': student.rollNo,
            'Class': student.class,
            'Month': format(selectedDate, 'MMMM yyyy'),
            'Days Present': Math.floor(Math.random() * 20) + 15,
            'Days Absent': Math.floor(Math.random() * 5)
          }));
          break;
      }

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
      XLSX.writeFile(wb, `attendance_${exportType}_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    }
  };

  // Handle view type change
  useEffect(() => {
    fetchAttendanceData();
  }, [viewType, students]);

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard/principal')}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Attendance Analytics</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={exportType} onValueChange={setExportType} disabled={loading}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Export Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={exportReport} 
              className="bg-blue-600 hover:bg-blue-700" 
              disabled={!exportType || loading}
            >
              <Download className="w-4 h-4 mr-2" />
              {loading ? 'Exporting...' : 'Export Excel'}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <p>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Select 
            value={selectedClass} 
            onValueChange={setSelectedClass}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {classList.map(cls => (
                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
                disabled={loading}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                disabled={loading}
              />
            </PopoverContent>
          </Popover>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search students..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="pl-10"
              disabled={loading}
            />
          </div>

          <Select 
            value={viewType} 
            onValueChange={setViewType}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="View Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Today</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.presentToday}</div>
              <p className="text-xs text-muted-foreground">
                {totalStats.totalStudents > 0 
                  ? `${((totalStats.presentToday / totalStats.totalStudents) * 100).toFixed(1)}% attendance` 
                  : 'No data'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Today</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.absentToday}</div>
              <p className="text-xs text-muted-foreground">
                {totalStats.totalStudents > 0 
                  ? `${((totalStats.absentToday / totalStats.totalStudents) * 100).toFixed(1)}% absent` 
                  : 'No data'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.avgAttendance}%</div>
              <p className="text-xs text-muted-foreground">This {viewType.slice(0, -2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{viewType.charAt(0).toUpperCase() + viewType.slice(1)} Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="present" fill="#3b82f6" name="Present" />
                    <Bar dataKey="absent" fill="#ef4444" name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No attendance data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Class-wise Table */}
        <Card>
          <CardHeader>
            <CardTitle>Class-wise Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {classAttendance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Class</th>
                      <th className="text-left py-2">Total Students</th>
                      <th className="text-left py-2">Present</th>
                      <th className="text-left py-2">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classAttendance.map((item) => (
                      <tr key={item.class} className="border-b">
                        <td className="py-2">{item.class}</td>
                        <td className="py-2">{item.total}</td>
                        <td className="py-2">{item.present}</td>
                        <td className="py-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            item.percentage >= 95 ? 'bg-green-100 text-green-800' :
                            item.percentage >= 90 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.percentage}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32">
                <p className="text-gray-500">No class attendance data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceAnalytics;

