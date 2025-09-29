import { useState } from 'react';
import { useApp } from '@/contexts/FixedAppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginScreenSimple = () => {
  console.log('LoginScreenSimple rendering...');
  
  // Try to get context, but handle errors gracefully
  let contextData = { login: null, register: null, isLoading: false, error: null, clearError: () => {} };
  try {
    const appContext = useApp();
    if (appContext) {
      contextData = appContext;
    }
    console.log('Context loaded successfully:', appContext);
  } catch (error) {
    console.error('Error loading context:', error);
  }
  
  const { login, register, isLoading: contextLoading, error: contextError, clearError } = contextData;
  
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (clearError) clearError();
    
    try {
      if (mode === 'login') {
        if (login) {
          await login(formData.email, formData.password);
          // Let natural routing handle the redirect after login
        } else {
          setError('Login function not available');
        }
      } else {
        if (register) {
          await register({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            student_id: formData.student_id || undefined,
            department: formData.department || undefined,
            year_of_study: formData.year_of_study || undefined,
          });
        } else {
          setError('Register function not available');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
          {(error || contextError) && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">
                {error || contextError}
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
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium"
              disabled={isLoading || contextLoading}
            >
              {(isLoading || contextLoading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'login' ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <p><strong>Student:</strong> student@suraksha.edu / demo123</p>
              <p><strong>Admin:</strong> admin@suraksha.edu / admin123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreenSimple;