import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Trophy, Medal, Star, Award } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/achievements")
      .then(res => res.json())
      .then(data => setAchievements(data))
      .catch(err => console.error("Error fetching achievements:", err));
  }, []);

  const categoryStats = [
    { category: 'Academic', count: achievements.filter(a => a.category === 'Academic').length, icon: <Star className="w-5 h-5" />, color: 'text-blue-600' },
    { category: 'Sports', count: achievements.filter(a => a.category === 'Sports').length, icon: <Trophy className="w-5 h-5" />, color: 'text-green-600' },
    { category: 'Arts', count: achievements.filter(a => a.category === 'Arts').length, icon: <Medal className="w-5 h-5" />, color: 'text-purple-600' },
    { category: 'Leadership', count: achievements.filter(a => a.category === 'Leadership').length, icon: <Award className="w-5 h-5" />, color: 'text-orange-600' }
  ];

  const getPositionBadge = (position: string) => {
    const colors = {
      '1st Place': 'bg-yellow-100 text-yellow-800',
      '2nd Place': 'bg-gray-100 text-gray-800',
      '3rd Place': 'bg-orange-100 text-orange-800',
      'Champions': 'bg-green-100 text-green-800',
      'Winner': 'bg-blue-100 text-blue-800'
    };
    return colors[position as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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
              <div className="p-2 rounded-full bg-pink-100">
                <Trophy className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">School Achievements</h1>
                <p className="text-gray-600">Recognition & accomplishments showcase</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {categoryStats.map((stat, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                  <span className={stat.color}>{stat.icon}</span>
                  <span className="ml-2">{stat.category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.count}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Achievements */}
        <Card className="bg-white/70 backdrop-blur-sm mb-6">
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Achievement</TableHead>
                  <TableHead>Student/Team</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {achievements.map((achievement: any) => (
                  <TableRow key={achievement.id}>
                    <TableCell className="font-medium">{achievement.title}</TableCell>
                    <TableCell>{achievement.student}</TableCell>
                    <TableCell>{achievement.grade}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPositionBadge(achievement.position)}`}>
                        {achievement.position}
                      </span>
                    </TableCell>
                    <TableCell>{achievement.category}</TableCell>
                    <TableCell>{achievement.date}</TableCell>
                    <TableCell className="font-medium text-green-600">{achievement.points}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Achievement Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Performers This Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                    <div>
                      <p className="font-medium">Emma Johnson</p>
                      <p className="text-sm text-gray-600">Grade 5 - 3 Gold medals</p>
                    </div>
                  </div>
                  <span className="text-yellow-600 font-bold">300 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Medal className="w-6 h-6 text-gray-600" />
                    <div>
                      <p className="font-medium">Michael Chen</p>
                      <p className="text-sm text-gray-600">Grade 4 - 2 Silver medals</p>
                    </div>
                  </div>
                  <span className="text-gray-600 font-bold">225 pts</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Award className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-medium">Sarah Williams</p>
                      <p className="text-sm text-gray-600">Grade 3 - 1 Bronze medal</p>
                    </div>
                  </div>
                  <span className="text-orange-600 font-bold">150 pts</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Upcoming Competitions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-medium">State Science Fair</p>
                  <p className="text-sm text-gray-600">January 15, 2025</p>
                  <p className="text-xs text-blue-600">5 students participating</p>
                </div>
                <div className="border-l-4 border-green-500 pl-3">
                  <p className="font-medium">Inter-school Debate</p>
                  <p className="text-sm text-gray-600">January 22, 2025</p>
                  <p className="text-xs text-green-600">Debate team ready</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <p className="font-medium">Art Exhibition</p>
                  <p className="text-sm text-gray-600">February 5, 2025</p>
                  <p className="text-xs text-purple-600">12 artworks selected</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-3">
                  <p className="font-medium">Regional Sports Meet</p>
                  <p className="text-sm text-gray-600">February 12, 2025</p>
                  <p className="text-xs text-orange-600">Athletes in training</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
