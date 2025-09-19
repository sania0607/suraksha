import React, { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card">
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">🛡️</div>
          <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Suraksha Platform
          </CardTitle>
          <CardDescription>
            Digital Disaster Preparedness for Educational Institutions
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select Your Role</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={selectedRole === 'student' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('student')}
                className="h-auto py-4 flex-col space-y-2"
              >
                <GraduationCap className="h-6 w-6" />
                <span>Student</span>
              </Button>
              <Button
                variant={selectedRole === 'admin' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('admin')}
                className="h-auto py-4 flex-col space-y-2"
              >
                <Shield className="h-6 w-6" />
                <span>Admin</span>
              </Button>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={!selectedRole || !name.trim()}
            className="w-full"
            variant="module"
          >
            <UserCheck className="h-4 w-4" />
            Access Platform
          </Button>

          {/* Demo Users */}
          <div className="border-t pt-4">
            <Label className="text-xs text-muted-foreground mb-2 block">Quick Demo Access</Label>
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map((demo) => (
                <Button
                  key={demo.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setName(demo.name);
                    setSelectedRole(demo.role);
                  }}
                  className="text-xs"
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