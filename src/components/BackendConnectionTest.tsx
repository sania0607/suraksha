// Test component to verify backend connection
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ConnectionStatus {
  status: 'checking' | 'connected' | 'disconnected';
  message: string;
}

const BackendConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'checking',
    message: 'Checking connection...'
  });
  const [testResults, setTestResults] = useState<Array<{ endpoint: string; status: boolean; message: string }>>([]);

  const testConnection = async () => {
    setConnectionStatus({ status: 'checking', message: 'Testing connection...' });
    setTestResults([]);
    
    const tests = [
      { endpoint: '/health', description: 'Health Check' },
      { endpoint: '/api/emergency/contacts/public', description: 'Emergency Contacts' },
      { endpoint: '/docs', description: 'API Documentation' },
    ];

    const results = [];
    let allPassed = true;

    for (const test of tests) {
      try {
        const response = await fetch(`http://127.0.0.1:8000${test.endpoint}`);
        const success = response.status >= 200 && response.status < 300;
        
        results.push({
          endpoint: test.description,
          status: success,
          message: success ? 'OK' : `HTTP ${response.status}`
        });
        
        if (!success) allPassed = false;
      } catch (error) {
        results.push({
          endpoint: test.description,
          status: false,
          message: 'Connection failed'
        });
        allPassed = false;
      }
    }

    setTestResults(results);
    setConnectionStatus({
      status: allPassed ? 'connected' : 'disconnected',
      message: allPassed 
        ? 'Backend connection successful!' 
        : 'Some endpoints failed. Check if backend is running on http://127.0.0.1:8000'
    });
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Suraksha Backend Connection Test</span>
              {connectionStatus.status === 'checking' && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
              {connectionStatus.status === 'connected' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {connectionStatus.status === 'disconnected' && <XCircle className="h-5 w-5 text-red-500" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                connectionStatus.status === 'connected' 
                  ? 'bg-green-50 border-green-200' 
                  : connectionStatus.status === 'disconnected'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              } border`}>
                <p className={`font-medium ${
                  connectionStatus.status === 'connected' 
                    ? 'text-green-800' 
                    : connectionStatus.status === 'disconnected'
                    ? 'text-red-800'
                    : 'text-blue-800'
                }`}>
                  {connectionStatus.message}
                </p>
              </div>

              {testResults.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Test Results:</h3>
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <span className="text-gray-700">{result.endpoint}</span>
                      <div className="flex items-center space-x-2">
                        {result.status ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className={`text-sm ${result.status ? 'text-green-600' : 'text-red-600'}`}>
                          {result.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button 
                onClick={testConnection} 
                disabled={connectionStatus.status === 'checking'}
                className="w-full"
              >
                {connectionStatus.status === 'checking' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Testing Connection...
                  </>
                ) : (
                  'Test Connection Again'
                )}
              </Button>

              {connectionStatus.status === 'connected' && (
                <div className="mt-6 space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">✅ Ready to Continue!</h3>
                    <p className="text-blue-800 text-sm">
                      Backend connection is working properly. You can now:
                    </p>
                    <ul className="text-blue-800 text-sm mt-2 space-y-1">
                      <li>• Log in to the application</li>
                      <li>• Register new users</li>
                      <li>• Access disaster modules</li>
                      <li>• Use emergency features</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/login'} 
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Continue to Suraksha Application →
                  </Button>
                </div>
              )}

              {connectionStatus.status === 'disconnected' && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-medium text-yellow-900 mb-2">⚠️ Connection Issues</h3>
                  <p className="text-yellow-800 text-sm">
                    Make sure the FastAPI backend server is running:
                  </p>
                  <code className="block mt-2 p-2 bg-gray-100 text-gray-800 text-xs rounded">
                    cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
                  </code>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BackendConnectionTest;