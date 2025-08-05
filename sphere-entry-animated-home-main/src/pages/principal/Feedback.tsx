import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { ArrowLeft, MessageSquare, Star } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import { toast } from '@/components/ui/use-toast';

type FeedbackType = {
  _id: string;
  type: 'Parent' | 'Teacher';
  teacherName?: string;
  class?: string;
  subject?: string;
  feedback?: string;
  rating?: number;
  date?: string;
};

const Feedback = () => {
  const navigate = useNavigate();
  const [feedbackData, setFeedbackData] = useState<FeedbackType[]>([]);
  const [filterType, setFilterType] = useState<'All' | 'Parent' | 'Teacher'>('All');

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await axios.get<FeedbackType[]>('http://localhost:5000/AddFeedback');
        setFeedbackData(res.data);
      } catch (err) {
        console.error('Error fetching:', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch feedback from server.',
          variant: 'destructive'
        });
      }
    };

    fetchFeedback();
  }, []);

  const renderStars = (rating = 0) => (
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  );

  const getRatingColor = (rating = 0) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredFeedback = feedbackData.filter(f => {
    return filterType === 'All' || f.type === filterType;
  });

  return (
    <div className="min-h-screen p-4 relative">
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
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
            <div className="p-2 rounded-full bg-cyan-100">
              <MessageSquare className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Feedback Center</h1>
              <p className="text-gray-600">Parent & teacher feedback management</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader><CardTitle>Total Feedback</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-blue-600">{feedbackData.length}</div></CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader><CardTitle>Parent Feedback</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-600">
              {feedbackData.filter(f => f.type === 'Parent').length}
            </div></CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader><CardTitle>Teacher Feedback</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-purple-600">
              {feedbackData.filter(f => f.type === 'Teacher').length}
            </div></CardContent>
          </Card>
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader><CardTitle>Average Rating</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold text-yellow-600">
              {feedbackData.length > 0
                ? (feedbackData.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbackData.length).toFixed(1)
                : '0.0'}
            </div></CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2 mb-4">
          {['All', 'Teacher', 'Parent'].map(type => (
            <Button
              key={type}
              variant={filterType === type ? 'default' : 'outline'}
              onClick={() => setFilterType(type as 'All' | 'Teacher' | 'Parent')}
            >
              {type} Feedback
            </Button>
          ))}
        </div>

        {/* Feedback Table */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader><CardTitle>{filterType} Feedback</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {filterType === 'Parent' ? (
                    <>
                      <TableHead>Teacher Name</TableHead>
                      <TableHead>Feedback</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Date</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>Type</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredFeedback.map(f => (
                  <TableRow key={f._id}>
                    {filterType === 'Parent' ? (
                      <>
                        <TableCell>{f.teacherName || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{f.feedback || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <div className="flex">{renderStars(f.rating)}</div>
                            <span className={`ml-2 font-medium ${getRatingColor(f.rating)}`}>
                              {f.rating ?? 0}/5
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{f.date ? new Date(f.date).toLocaleDateString() : '-'}</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            f.type === 'Parent' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {f.type}
                          </span>
                        </TableCell>
                        <TableCell>{f.class || 'N/A'}</TableCell>
                        <TableCell>{f.subject || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <div className="flex">{renderStars(f.rating)}</div>
                            <span className={`ml-2 font-medium ${getRatingColor(f.rating)}`}>
                              {f.rating ?? 0}/5
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{f.feedback || '-'}</TableCell>
                        <TableCell>{f.date ? new Date(f.date).toLocaleDateString() : '-'}</TableCell>
                      </>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Feedback;
