import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Play, Edit, Trash2, Grid, List } from 'lucide-react';
import axios from 'axios';

type Video = {
  _id: string;
  title: string;
  subject: string;
  url: string;
  thumbnail: string;
  uploadDate: string;
};

const Videos = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [videos, setVideos] = useState<Video[]>([]);
  const [formData, setFormData] = useState({ title: '', subject: '', url: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:5000/videos')
      .then(res => setVideos(res.data))
      .catch(err => console.error('Error fetching videos:', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await axios.put(`http://localhost:5000/videos/${editingId}`, formData);
        setVideos(prev => prev.map(video => (video._id === editingId ? res.data : video)));
      } else {
        const res = await axios.post('http://localhost:5000/videos', formData);
        setVideos(prev => [res.data, ...prev]);
      }

      setFormData({ title: '', subject: '', url: '' });
      setEditingId(null);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error submitting video:', err);
    }
  };

  const handleEdit = (video: Video) => {
    setFormData({ title: video.title, subject: video.subject, url: video.url });
    setEditingId(video._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/videos/${id}`);
      setVideos(prev => prev.filter(video => video._id !== id));
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-cyan-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate('/dashboard/teacher')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Video Library</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant={viewMode === 'grid' ? 'default' : 'outline'} onClick={() => setViewMode('grid')}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}>
              <List className="w-4 h-4" />
            </Button>
            <Button onClick={() => setShowAddForm(true)} className="bg-cyan-600 hover:bg-cyan-700">
              <Plus className="w-4 h-4 mr-2" /> Add Video
            </Button>
          </div>
        </div>

        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit Video' : 'Add New Video'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Video Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter video title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Video URL</label>
                  <Input
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/..."
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    {editingId ? 'Update' : 'Add'} Video
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingId(null);
                      setFormData({ title: '', subject: '', url: '' });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
              <Card key={video._id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={video.thumbnail || `https://img.youtube.com/vi/${extractYouTubeID(video.url)}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <a href={video.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="absolute inset-0 m-auto w-12 h-12 rounded-full">
                      <Play className="w-6 h-6" />
                    </Button>
                  </a>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{video.subject}</p>
                  <p className="text-xs text-gray-500 mb-4">{video.uploadDate}</p>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(video._id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {videos.map(video => (
                  <div key={video._id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={video.thumbnail || `https://img.youtube.com/vi/${extractYouTubeID(video.url)}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{video.title}</h3>
                        <p className="text-sm text-gray-600">
                          {video.subject} • {video.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <a href={video.url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline">
                          <Play className="w-4 h-4" />
                        </Button>
                      </a>
                      <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(video._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Helper to extract YouTube video ID from URL
const extractYouTubeID = (url: string): string => {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : '';
};

export default Videos;
