import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Bus, MapPin, Clock, Users, AlertCircle, CheckCircle } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import AddBusForm from '@/components/AddBusForm';

const BusTracking = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [busRoutes, setBusRoutes] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/addbus');
      setBusRoutes(res.data);
    } catch (err) {
      console.error("Error fetching buses:", err);
    }
  };

  const handleBusAdded = () => {
    fetchBuses(); // Refresh list after new bus is added
    setShowForm(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Time':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Delayed':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Arrived':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time':
        return 'bg-green-100 text-green-800';
      case 'Delayed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Arrived':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen p-4 relative">
      <AnimatedBackground />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
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
              <div className="p-2 rounded-full bg-emerald-100">
                <Bus className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Bus Tracking System</h1>
                <p className="text-gray-600">Real-time route monitoring & student transport</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-end">
          <Button onClick={() => setShowForm(true)} className="bg-emerald-600 text-white hover:bg-emerald-700">
            + Add New Bus
          </Button>
        </div>

        {showForm && (
          <div className="mb-6">
            <AddBusForm onClose={handleBusAdded} />
          </div>
        )}

        <Card className="bg-white/70 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle>Live Bus Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bus ID</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Current Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ETA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {busRoutes.map((bus: any) => (
                  <TableRow key={bus._id}>
                    <TableCell className="font-medium">{bus.busId}</TableCell>
                    <TableCell>{bus.routeName}</TableCell>
                    <TableCell>{bus.driver.name}</TableCell>
                    <TableCell className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                      {bus.currentStop}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(bus.status)}
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(bus.status)}`}>
                          {bus.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-gray-400" />
                      {bus.eta}
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

export default BusTracking;
