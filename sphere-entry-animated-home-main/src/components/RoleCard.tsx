
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RoleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  role: string;
  gradient: string;
}

const RoleCard: React.FC<RoleCardProps> = ({ title, description, icon, role, gradient }) => {
  const navigate = useNavigate();

  const handleRoleSelect = () => {
    console.log(`Navigating to login with role: ${role}`);
    navigate(`/login?role=${role}`);
  };

  return (
    <Card className={`w-full max-w-sm card-hover cursor-pointer group ${gradient} border-0 shadow-lg animate-scale-in`} onClick={handleRoleSelect}>
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-4 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-all duration-300">
          <div className="text-4xl">
            {icon}
          </div>
        </div>
        <CardTitle className="text-2xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 group-hover:text-gray-700 transition-colors">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button 
          className="w-full bg-white/80 hover:bg-white text-gray-800 hover:text-gray-900 border-0 shadow-md hover:shadow-lg transition-all duration-300 font-medium"
          size="lg"
        >
          Login as {role}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
