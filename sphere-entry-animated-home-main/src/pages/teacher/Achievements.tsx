import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Trophy, Trash2, Upload, Download } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Achievements = () => {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    student: '',
    title: '',
    category: '',
    date: '',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/achievements');
        if (!response.ok) throw new Error('Failed to fetch achievements');
        const data = await response.json();
        setAchievements(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.warn('Please upload a file (image or PDF)');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => formDataToSend.append(key, formData[key]));
    formDataToSend.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/achievements', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create achievement');
      }

      const newAchievement = await response.json();
      setAchievements(prev => [newAchievement, ...prev]);
      setShowAddForm(false);
      setFormData({ student: '', title: '', category: '', date: '', description: '' });
      setSelectedFile(null);
      toast.success('Achievement added successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;
    try {
      const response = await fetch(`http://localhost:5000/achievements/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete achievement');
      setAchievements(prev => prev.filter(a => a._id !== id));
      toast.success('Achievement deleted successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDownload = (fileUrl, title) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-yellow-50 to-orange-50">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="max-w-7xl mx-auto">
        {/* HEADER Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Button
            onClick={() => navigate('/dashboard/teacher')}
            variant="outline"
            size="sm"
            className="w-fit self-start sm:w-auto text-sm px-3 py-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 text-center sm:text-left">
            Student Achievements
          </h1>
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-yellow-600 hover:bg-yellow-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Achievement
          </Button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Record New Achievement</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['student', 'title', 'category', 'date'].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                      <Input
                        id={field}
                        name={field}
                        value={formData[field]}
                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        placeholder={`Enter ${field}`}
                        required
                        type={field === 'date' ? 'date' : 'text'}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter achievement description"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Upload File (Image/PDF)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="mx-auto h-10 w-10 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">Click to upload image or certificate</p>
                      <p className="text-xs text-gray-500">JPG, PNG, PDF files accepted (max 10MB)</p>
                      {selectedFile && (
                        <p className="mt-2 text-sm font-semibold text-green-600">{selectedFile.name}</p>
                      )}
                    </Label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-2 pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full md:w-auto">
                    Save Achievement
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full md:w-auto"
                    onClick={() => {
                      setShowAddForm(false);
                      setFormData({ student: '', title: '', category: '', date: '', description: '' });
                      setSelectedFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Achievements Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
              </div>
            ) : achievements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No achievements found.
                {!showAddForm && (
                  <Button variant="link" className="text-yellow-600" onClick={() => setShowAddForm(true)}>
                    Add your first achievement
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="min-w-full text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Achievement</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {achievements.map((achievement) => (
                      <TableRow key={achievement._id}>
                        <TableCell>{achievement.student}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Trophy className="w-4 h-4 mr-2 text-yellow-600" />
                            {achievement.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              achievement.category === 'Academic'
                                ? 'bg-blue-100 text-blue-800'
                                : achievement.category === 'Sports'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {achievement.category}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(achievement.date).toLocaleDateString()}</TableCell>
                        <TableCell className="max-w-xs truncate">{achievement.description}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center space-x-2">
                            {achievement.fileUrl && (
                              <Button size="sm" variant="outline" onClick={() => handleDownload(achievement.fileUrl, achievement.title)}>
                                <Download className="w-4 h-4" />
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(achievement._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Achievements;
