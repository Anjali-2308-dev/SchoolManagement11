import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, Save } from 'lucide-react';
import axios from 'axios';

const Timetable = () => {
  const navigate = useNavigate();

  const timeSlots = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00'];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const subjects = [
    'Math - Mr. Smith', 'English - Ms. Rose', 'Science - Dr. Johnson',
    'History - Mrs. Lee', 'Geography - Mr. Kumar', 'Art - Ms. Gomez',
    'Music - Mr. Charles', 'PE - Coach Carter', 'IT - Ms. Watson', 'Break'
  ];

  const classOptions = ['10A', '10B', '11A', '11B'];
  const [selectedClass, setSelectedClass] = useState('10A');
  const [isLoading, setIsLoading] = useState(false);
  const [timetableData, setTimetableData] = useState<Record<string, string[]>>({});

  // Default timetable: every day has empty periods filled with "Break"
  const initializeTimetable = (): Record<string, string[]> => {
    const defaultTable: Record<string, string[]> = {};
    days.forEach(day => {
      defaultTable[day] = Array(timeSlots.length).fill('Break');
    });
    return defaultTable;
  };

  const normalizeTimetable = (entries: Record<string, string[]> = {}): Record<string, string[]> => {
    const normalized = initializeTimetable();
    for (const day of days) {
      if (entries[day]) {
        const filled = entries[day].slice(0, timeSlots.length); // Trim extra
        while (filled.length < timeSlots.length) {
          filled.push('Break'); // Fill missing
        }
        normalized[day] = filled;
      }
    }
    return normalized;
  };

  // Fetch from backend when class changes
  useEffect(() => {
    const fetchTimetable = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/timetable/${selectedClass}`);
        const entries = res.data?.data?.entries;
        const normalized = normalizeTimetable(entries);
        setTimetableData(normalized);
      } catch (err) {
        console.error('Error loading timetable:', err);
        setTimetableData(initializeTimetable());
      } finally {
        setIsLoading(false);
      }
    };
    fetchTimetable();
  }, [selectedClass]);

  // Change subject handler
  const handleSubjectChange = (day: string, timeIndex: number, subject: string) => {
    setTimetableData(prev => ({
      ...prev,
      [day]: prev[day].map((s, i) => (i === timeIndex ? subject : s))
    }));
  };

  // Save updated timetable
  const saveTimetable = async () => {
    try {
      setIsLoading(true);
      const payload = {
        className: selectedClass,
        section: selectedClass.slice(-1),
        academicYear: '2024-25',
        entries: timetableData
      };
      const res = await axios.post('http://localhost:5000/timetable', payload);
      console.log('Timetable saved:', res.data);
    } catch (err: any) {
      console.error('Error saving timetable:', err.response?.data || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = () => {
    alert('Export to PDF coming soon!');
  };

  if (isLoading || Object.keys(timetableData).length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-blue-50">
        <p className="text-gray-600 text-lg">Loading timetable...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Timetable Management</h1>
          </div>
          <div className="flex space-x-2">
            <Button onClick={saveTimetable} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Class Selector */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="class-select" className="text-gray-700 font-medium">Select Class:</label>
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {classOptions.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Timetable Table */}
        <Card>
          <CardHeader>
            <CardTitle>Class {selectedClass} Timetable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border p-3 bg-gray-100 font-semibold text-left">Time</th>
                    {days.map(day => (
                      <th key={day} className="border p-3 bg-gray-100 font-semibold text-center">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, timeIndex) => (
                    <tr key={slot}>
                      <td className="border p-3 bg-gray-50 font-medium">{slot}</td>
                      {days.map(day => (
                        <td key={`${day}-${timeIndex}`} className="border p-2">
                          <select
                            value={timetableData[day]?.[timeIndex] || 'Break'}
                            onChange={(e) => handleSubjectChange(day, timeIndex, e.target.value)}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {subjects.map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timetable;
