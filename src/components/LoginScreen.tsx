import { useState } from 'react';
import { useApp, User } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, GraduationCap, UserCheck } from 'lucide-react';

const LoginScreen = () => {
  const { setUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<'student' | 'admin' | null>(null);
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (!selectedRole || !name.trim()) return;

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      role: selectedRole,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@school.edu`,
    };

    setUser(user);
  };

  const demoUsers = [
    { name: 'Alex Student', role: 'student' as const },
    { name: 'Sarah Admin', role: 'admin' as const },
  ];

  return (
    <div className="min-h-screen bg-teal-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-teal-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-teal-600">
            Suraksha Platform
          </CardTitle>
          <CardDescription className="text-gray-600">
            Digital Disaster Preparedness for Educational Institutions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Select Your Role</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setSelectedRole('student')}
                className={`h-auto py-4 flex-col space-y-2 transition-all duration-200 ${
                  selectedRole === 'student' 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-white border-2 border-teal-200 text-teal-600 hover:bg-teal-50'
                }`}
              >
                <GraduationCap className="h-6 w-6" />
                <span>Student</span>
              </Button>
              <Button
                onClick={() => setSelectedRole('admin')}
                className={`h-auto py-4 flex-col space-y-2 transition-all duration-200 ${
                  selectedRole === 'admin' 
                    ? 'bg-orange-400 text-white' 
                    : 'bg-white border-2 border-orange-200 text-orange-400 hover:bg-orange-50'
                }`}
              >
                <Shield className="h-6 w-6" />
                <span>Admin</span>
              </Button>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={!selectedRole || !name.trim()}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 font-medium disabled:bg-gray-300"
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Access Platform
          </Button>

          {/* Demo Users */}
          <div className="border-t border-gray-200 pt-4">
            <Label className="text-xs text-gray-500 mb-2 block">Quick Demo Access</Label>
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map((demo) => (
                <Button
                  key={demo.name}
                  onClick={() => {
                    setName(demo.name);
                    setSelectedRole(demo.role);
                  }}
                  className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 py-2"
                >
                  {demo.name}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;