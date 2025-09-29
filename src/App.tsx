import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/FixedAppContext";
import { AIProvider } from "@/contexts/AIContext";
import { WeatherProvider } from "@/contexts/WeatherContext";
import LoginScreen from "@/components/LoginScreen";
import LoginScreenSimple from "@/components/LoginScreenSimple";
import SimpleLogin from "@/components/SimpleLogin";
import BackendConnectionTest from "@/components/BackendConnectionTest";
import LandingPage from "@/components/LandingPage";
import Layout from "@/components/Layout";
import TestPage from "@/components/TestPage";
import AuthDebugScreen from "@/components/AuthDebugScreen";

// Student Pages
import StudentHome from "@/pages/student/StudentHome";
import SimpleStudentHome from "@/components/SimpleStudentHome";
import StudentProfile from "@/pages/student/StudentProfile";
import ModuleDetailSimple from "@/pages/student/ModuleDetailSimple";
import ModulesPageSimple from "@/pages/student/ModulesPageSimple";
import DrillSimulator from "@/pages/student/DrillSimulator";
import CampusMap from "@/pages/student/CampusMap";
import EvacuationPractice from "@/pages/student/EvacuationPractice";
import EmergencyContacts from "@/pages/student/EmergencyContacts";
import EmergencyCenter from "@/pages/student/EmergencyCenter";
import VirtualDrillSimulator from "@/pages/student/VirtualDrillSimulator";
import StudentWeatherAlerts from "@/pages/student/WeatherAlerts";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminAnalyticsDashboard from "@/pages/admin/AdminAnalyticsDashboard";

// AI Assistant
import AIAssistant from "@/pages/AIAssistant";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'student' | 'admin' }) => {
  const { user } = useApp();
  
  if (!user) {
    return <LoginScreen />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'student' ? '/student' : '/admin'} replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  try {
    const { user, isAuthenticated, isLoading } = useApp();
    
    console.log('AppContent render:', { 
      user, 
      isAuthenticated, 
      isLoading, 
      pathname: window.location.pathname,
      userRole: user?.role 
    });
    
    // Quick debug - show auth debug screen
    if (window.location.pathname === '/debug-auth') {
      return <AuthDebugScreen />;
    }
    
    // Quick test - show test page if going to /test
    if (window.location.pathname === '/test') {
      return <TestPage />;
    }
    
    // Show loading while initializing
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading Suraksha Platform...</p>
          </div>
        </div>
      );
    }
    
    // Show connection test only if specifically requested
    if (window.location.pathname === '/test-connection') {
      return <BackendConnectionTest />;
    }
    
    // If not authenticated, show login or landing page
    if (!isAuthenticated) {
      if (window.location.pathname === '/login') {
        return <LoginScreenSimple />;
      }
      return <LandingPage />;
    }
    
    // User is authenticated - show the main app routes
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Student Routes */}
          <Route path="student" element={<SimpleStudentHome />} />
          <Route path="student/modules" element={<ModulesPageSimple />} />
          <Route path="student/modules/:moduleId" element={<ModuleDetailSimple />} />
          <Route path="student/virtual-drills" element={<VirtualDrillSimulator />} />
          <Route path="student/drills/:moduleId" element={<DrillSimulator />} />
          <Route path="student/emergency" element={<EmergencyCenter />} />
          <Route path="student/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="student/weather-alerts" element={<StudentWeatherAlerts />} />
          <Route path="student/campus-map" element={<CampusMap />} />
          <Route path="student/evacuation-practice" element={<EvacuationPractice />} />
          <Route path="student/profile" element={<StudentProfile />} />
          <Route path="student/ai-assistant" element={<AIAssistant />} />

          {/* Admin Routes */}
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/analytics-dashboard" element={<AdminAnalyticsDashboard />} />
          <Route path="admin/drill" element={<AdminDashboard />} />
          <Route path="admin/analytics" element={<AdminAnalytics />} />
          <Route path="admin/ai-assistant" element={<AIAssistant />} />

          {/* Default Route - redirect to appropriate dashboard */}
          <Route index element={
            <Navigate to={user?.role === 'student' ? '/student' : '/admin'} replace />
          } />
        </Route>
        
        {/* Public Routes outside Layout */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/test-connection" element={<BackendConnectionTest />} />
        <Route path="/debug-auth" element={<AuthDebugScreen />} />
        
        {/* Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  } catch (error) {
    console.error('AppContent error:', error);
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Application Error</h1>
          <p className="text-red-600">Something went wrong. Check the console for details.</p>
        </div>
      </div>
    );
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AIProvider>
            <WeatherProvider>
              <AppContent />
            </WeatherProvider>
          </AIProvider>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
