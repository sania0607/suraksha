import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import LoginScreen from "@/components/LoginScreen";
import LandingPage from "@/components/LandingPage";
import Layout from "@/components/Layout";

// Student Pages
import StudentHome from "@/pages/student/StudentHome";
import StudentModules from "@/pages/student/StudentModules";
import StudentDrills from "@/pages/student/StudentDrills";
import StudentProfile from "@/pages/student/StudentProfile";
import ModuleDetail from "@/pages/student/ModuleDetail";
import DrillSimulator from "@/pages/student/DrillSimulator";
import SOSScreen from "@/pages/student/SOSScreen";
import CampusMap from "@/pages/student/CampusMap";
import EvacuationPractice from "@/pages/student/EvacuationPractice";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";

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
  const { user, showLogin } = useApp();
  
  if (!user && !showLogin) {
    return <LandingPage />;
  }
  
  if (!user) {
    return <LoginScreen />;
  }
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Student Routes */}
        <Route path="student" element={<StudentHome />} />
        <Route path="student/modules" element={<StudentModules />} />
        <Route path="student/modules/:moduleId" element={<ModuleDetail />} />
        <Route path="student/drills" element={<StudentDrills />} />
        <Route path="student/drills/:moduleId" element={<DrillSimulator />} />
        <Route path="student/campus-map" element={<CampusMap />} />
        <Route path="student/evacuation-practice" element={<EvacuationPractice />} />
        <Route path="student/sos" element={<SOSScreen />} />
        <Route path="student/profile" element={<StudentProfile />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/drill" element={<AdminDashboard />} />
        <Route path="admin/analytics" element={<AdminAnalytics />} />

        {/* Default Route */}
        <Route index element={
          <Navigate to={user.role === 'student' ? '/student' : '/admin'} replace />
        } />
      </Route>
      
      {/* Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
