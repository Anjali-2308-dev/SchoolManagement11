import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { ArrowLeft, FileText, Search } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import axios from 'axios';

const subjectFields = [
  'math',
  'english',
  'science',
  'socialStudies',
  'computer',
  'hindi',
];

const AcademicReports = () => {
  const [performance, setPerformance] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/grades')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setPerformance(data);
        } else if (Array.isArray(data.students)) {
          setPerformance(data.students);
        } else {
          console.error('Unexpected response format', data);
        }
      })
      .catch(err => {
        console.error('API error:', err);
      });
  }, []);

  const filteredStudents = performance.filter(student =>
    (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.class || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.rollNo || '').toString().includes(searchTerm)
  );

  const getGradeColor = (marks) => {
    if (marks >= 90) return 'text-green-600';
    if (marks >= 80) return 'text-blue-600';
    if (marks >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadgeColor = (grade) => {
    if (!grade) return '';
    if (grade === 'A+' || grade === 'A') return 'bg-green-100 text-green-800';
    if (grade === 'B+' || grade === 'B') return 'bg-blue-100 text-blue-800';
    if (grade === 'C') return 'bg-yellow-100 text-yellow-800';
    if (grade === 'D') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const calculateOverall = (student) => {
    const total = subjectFields.reduce((sum, subject) => sum + (Number(student[subject]) || 0), 0);
    return Math.round(total / subjectFields.length);
  };

  return (
    <div className="min-h-screen p-4 relative">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate('/dashboard/principal')}
              variant="outline"
              size="sm"
              className="bg-white/70 hover:bg-white/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-orange-100">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Academic Performance</h1>
                <p className="text-gray-600">Student subject-wise performance overview</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by student name, class, or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{performance.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {performance.length > 0 ? `${(
                  performance.reduce((acc, curr) => acc + calculateOverall(curr), 0) / performance.length
                ).toFixed(1)}%` : '0%'}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {performance.filter(s => calculateOverall(s) >= 90).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {[...new Set(performance.map(s => s.class))].length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Student Academic Performance Report</CardTitle>
            <p className="text-sm text-gray-600">Real-time performance view synced from Teacher Dashboard</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    {subjectFields.map((subject) => (
                      <TableHead key={subject} className="text-center">
                        {subject.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </TableHead>
                    ))}
                    <TableHead className="text-center">Total Marks</TableHead>
                    <TableHead className="text-center">Average</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const marks = subjectFields.map((field) => Number(student[field]) || 0);
                    const totalMarks = student.totalMarks ?? marks.reduce((a, b) => a + b, 0);
                    const overall = Math.round(totalMarks / subjectFields.length);
                    return (
                      <TableRow key={student._id || student.id}>
                        <TableCell>{student.rollNo}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {student.class}
                          </span>
                        </TableCell>
                        {subjectFields.map((subject) => (
                          <TableCell key={subject} className={`text-center font-semibold ${getGradeColor(student[subject])}`}>
                            {student[subject]}
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-bold">{totalMarks}</TableCell>
                        <TableCell className={`text-center font-bold ${getGradeColor(overall)}`}>{overall}</TableCell>
                        <TableCell className="text-center">
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeBadgeColor(student.grade)}`}>
                            {student.grade}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AcademicReports;