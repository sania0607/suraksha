import { useState } from 'react';
import { useMinimalApp } from '@/contexts/MinimalAppContext';

const MinimalLogin = () => {
  console.log('MinimalLogin rendering...');
  
  const { login, isLoading, error, clearError } = useMinimalApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submit triggered!', e);
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    clearError();
    
    // Add immediate feedback
    alert(`Attempting login with: ${formData.email}`);
    
    try {
      console.log('Calling login function...');
      await login(formData.email, formData.password);
      console.log('Login function completed');
    } catch (error) {
      console.error('Login error:', error);
      alert(`Login error: ${error}`);
    }
  };

  const handleTestClick = () => {
    console.log('Test button clicked!');
    alert('Button click works!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-teal-600 mb-6 text-center">Minimal Login Test</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="student@suraksha.edu"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              placeholder="demo123"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50"
            onClick={(e) => {
              console.log('Button clicked!', e);
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <button
            type="button"
            onClick={handleTestClick}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg mt-2"
          >
            Test Button Click
          </button>
          
          <button
            type="button"
            onClick={() => {
              console.log('Direct login button clicked!');
              handleSubmit({ preventDefault: () => {} } as React.FormEvent);
            }}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg mt-2"
          >
            Direct Login Test
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <p><strong>Student:</strong> student@suraksha.edu / demo123</p>
            <p><strong>Admin:</strong> admin@suraksha.edu / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalLogin;