import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MinimalAppProvider, useMinimalApp } from "@/contexts/MinimalAppContext";
import MinimalLogin from "@/components/MinimalLogin";

const AppContent = () => {
  const { user, isAuthenticated, isLoading } = useMinimalApp();
  
  console.log('Minimal AppContent render:', { 
    user, 
    isAuthenticated, 
    isLoading, 
    pathname: window.location.pathname 
  });
  
  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Show login if not authenticated
  if (!isAuthenticated) {
    return <MinimalLogin />;
  }
  
  // Show authenticated screen
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Authentication Successful!</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
          <div className="text-left bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">User Details:</h3>
            <p><strong>ID:</strong> {user?.id}</p>
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          >
            Test Again
          </button>
        </div>
      </div>
    </div>
  );
};

const MinimalApp = () => {
  console.log('MinimalApp rendering...');
  
  return (
    <BrowserRouter>
      <MinimalAppProvider>
        <AppContent />
      </MinimalAppProvider>
    </BrowserRouter>
  );
};

export default MinimalApp;