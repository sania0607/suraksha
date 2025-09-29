import React from 'react';
import { useApp } from '@/contexts/FixedAppContext';

const AuthDebugScreen = () => {
  const { user, isAuthenticated, isLoading, error } = useApp();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Authentication Debug Screen</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Current State:</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Is Authenticated:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isAuthenticated ? 'Yes' : 'No'}
                </span>
              </div>
              <div>
                <strong>Is Loading:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                  {isLoading ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">User Object:</h3>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {user ? JSON.stringify(user, null, 2) : 'null'}
            </pre>
          </div>
          
          {error && (
            <div>
              <h3 className="font-semibold mb-2 text-red-600">Error:</h3>
              <div className="bg-red-100 p-4 rounded text-red-800">
                {error}
              </div>
            </div>
          )}
          
          <div>
            <h3 className="font-semibold mb-2">Current Location:</h3>
            <div className="bg-blue-100 p-4 rounded text-blue-800">
              {window.location.pathname}
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Home
            </button>
            <button 
              onClick={() => window.location.href = '/student'}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
            >
              Go to Student
            </button>
            <button 
              onClick={() => window.location.href = '/admin'}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
            >
              Go to Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebugScreen;