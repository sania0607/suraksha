import { useState } from 'react';
import { useApp } from '@/contexts/FixedAppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, GraduationCap, UserCheck, Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginScreen = () => {
  const { login, register, isLoading, error, clearError } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    student_id: '',
    department: '',
    year_of_study: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          student_id: formData.student_id || undefined,
          department: formData.department || undefined,
          year_of_study: formData.year_of_study || undefined,
        });
      }
    } catch (error) {
      // Error is handled in context
      console.error('Authentication error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const demoCredentials = [
    { email: 'student@suraksha.edu', password: 'demo123', name: 'Demo Student' },
    { email: 'admin@suraksha.edu', password: 'admin123', name: 'Demo Admin' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl bg-white backdrop-blur-sm">
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
          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Mode Toggle */}
          <div className="grid grid-cols-2 gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              type="button"
              onClick={() => setMode('login')}
              className={`text-sm py-2 ${
                mode === 'login'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              Sign In
            </Button>
            <Button
              type="button"
              onClick={() => setMode('register')}
              className={`text-sm py-2 ${
                mode === 'register'
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'bg-transparent text-gray-600 hover:bg-gray-50'
              }`}
            >
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (Register only) */}
            {mode === 'register' && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required={mode === 'register'}
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  className="border-gray-300 focus:border-teal-500 focus:ring-teal-500 pr-10"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 bg-transparent hover:bg-gray-100 text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Student Info (Register only) */}
            {mode === 'register' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="student_id" className="text-gray-700">Student ID (Optional)</Label>
                  <Input
                    id="student_id"
                    type="text"
                    placeholder="Enter your student ID"
                    value={formData.student_id}
                    onChange={(e) => handleInputChange('student_id', e.target.value)}
                    className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-700">Department</Label>
                    <Input
                      id="department"
                      type="text"
                      placeholder="Your department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year_of_study" className="text-gray-700">Year</Label>
                    <Input
                      id="year_of_study"
                      type="text"
                      placeholder="Year of study"
                      value={formData.year_of_study}
                      onChange={(e) => handleInputChange('year_of_study', e.target.value)}
                      className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 font-medium disabled:bg-gray-400"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <UserCheck className="h-4 w-4 mr-2" />
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          {mode === 'login' && (
            <div className="border-t border-gray-200 pt-4">
              <Label className="text-xs text-gray-500 mb-2 block">Demo Accounts</Label>
              <div className="space-y-2">
                {demoCredentials.map((demo) => (
                  <Button
                    key={demo.email}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        email: demo.email,
                        password: demo.password
                      }));
                    }}
                    className="w-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 py-2 justify-start"
                  >
                    <GraduationCap className="h-3 w-3 mr-2" />
                    {demo.name} - {demo.email}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;