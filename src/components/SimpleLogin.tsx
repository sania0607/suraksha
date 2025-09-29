import React from 'react';

const SimpleLogin = () => {
  console.log('SimpleLogin rendering...');
  
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Simple Login Test</h1>
        <p>If you can see this, React rendering works!</p>
        <form className="space-y-4 mt-4">
          <div>
            <label htmlFor="email">Email:</label>
            <input 
              id="email"
              type="email" 
              className="w-full p-2 border rounded"
              placeholder="test@example.com"
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input 
              id="password"
              type="password" 
              className="w-full p-2 border rounded"
              placeholder="password"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SimpleLogin;