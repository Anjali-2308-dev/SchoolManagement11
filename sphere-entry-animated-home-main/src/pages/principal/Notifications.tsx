import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Bell, Send, Eye, Users } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/AddNotification")
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
      })
      .catch(err => console.error("Error fetching notifications:", err));
  }, []);

  const deliveryStats = [
    { metric: 'Total Sent', value: notifications.length, color: 'text-blue-600' },
    { metric: 'Delivered', value: Math.floor(notifications.length * 0.95), color: 'text-green-600' },
    { metric: 'Opened', value: Math.floor(notifications.length * 0.75), color: 'text-purple-600' },
    { metric: 'Failed', value: Math.floor(notifications.length * 0.05), color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen p-4 relative">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
              <div className="p-2 rounded-full bg-indigo-100">
                <Bell className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Notification Center</h1>
                <p className="text-gray-600">Message history & delivery analytics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {deliveryStats.map((stat, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.metric}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Send className="w-5 h-5 mr-2 text-blue-600" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
              <p className="text-sm text-gray-600">Messages sent</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Eye className="w-5 h-5 mr-2 text-green-600" />
                Open Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{Math.floor((notifications.length * 0.75))}%</div>
              <p className="text-sm text-gray-600">Average engagement</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Total Reach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{notifications.reduce((sum, n) => sum + (n.recipients || 0), 0)}</div>
              <p className="text-sm text-gray-600">Recipients reached</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications Table */}
        <Card className="bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((n) => (
                  <TableRow key={n._id}>
                    <TableCell>{n.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{n.message}</TableCell>
                    <TableCell>{n.audience}</TableCell>
                    <TableCell>{n.recipients}</TableCell>
                    <TableCell>{new Date(n.sentDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {n.status}
                      </span>
                    </TableCell>
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

export default Notifications;
