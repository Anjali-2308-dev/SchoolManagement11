
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Crown, GraduationCap, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AnimatedBackground from '@/components/AnimatedBackground';

const Login = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchParams.get('role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('Login page loaded with role:', role);
    if (!role || (role !== 'principal' && role !== 'teacher')) {
      console.log('Invalid role, redirecting to home');
      navigate('/');
    }
  }, [role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    console.log('Login attempt:', { role, email, password });
    
    // Simple validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Mock authentication - in real app, this would call an API
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login (you can customize these credentials)
      const validCredentials = {
        principal: { email: 'principal@edusphere.com', password: 'admin123' },
        teacher: { email: 'teacher@edusphere.com', password: 'teach123' }
      };

      const roleCredentials = validCredentials[role as keyof typeof validCredentials];
      
      if (email === roleCredentials.email && password === roleCredentials.password) {
        console.log('Login successful, redirecting to dashboard');
        // Store user info in localStorage (in real app, use proper auth tokens)
        localStorage.setItem('user', JSON.stringify({ role, email }));
        navigate(`/dashboard/${role}`);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!role) {
    return null;
  }

  const isPrincipal = role === 'principal';
  const roleTitle = isPrincipal ? 'Principal' : 'Teacher';
  const roleIcon = isPrincipal ? <Crown className="w-8 h-8" /> : <GraduationCap className="w-8 h-8" />;
  const cardGradient = isPrincipal 
    ? 'bg-gradient-to-br from-blue-100 via-purple-50 to-blue-50' 
    : 'bg-gradient-to-br from-purple-100 via-pink-50 to-purple-50';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <AnimatedBackground />
      
      <div className="w-full max-w-md animate-fade-in-up">
        <Button 
          variant="ghost" 
          className="mb-6 text-gray-600 hover:text-gray-800"
          onClick={handleBackToHome}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <Card className={`${cardGradient} border-0 shadow-xl backdrop-blur-sm`}>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 rounded-full bg-white/30 backdrop-blur-sm">
              {roleIcon}
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              {roleTitle} Login
            </CardTitle>
            <CardDescription className="text-gray-600">
              Welcome back! Please sign in to continue.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/70 border-white/30 focus:bg-white/90 transition-all duration-300"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/70 border-white/30 focus:bg-white/90 transition-all duration-300"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : `Sign In as ${roleTitle}`}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <div className="text-xs text-gray-500 bg-white/50 p-2 rounded">
                <p><strong>Demo Credentials:</strong></p>
                <p>{roleTitle}: {role}@edusphere.com</p>
                <p>Password: {isPrincipal ? 'admin123' : 'teach123'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
