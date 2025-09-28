import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { AIProvider } from "@/contexts/AIContext";
import LoginScreen from "@/components/LoginScreen";
import LandingPage from "@/components/LandingPage";
import Layout from "@/components/Layout";

// Student Pages
import StudentHome from "@/pages/student/StudentHome";
import StudentProfile from "@/pages/student/StudentProfile";
import ModuleDetail from "@/pages/student/ModuleDetail";
import ModuleDetailNew from "@/pages/student/ModuleDetailNew";
import DrillSimulator from "@/pages/student/DrillSimulator";
import CampusMap from "@/pages/student/CampusMap";
import EvacuationPractice from "@/pages/student/EvacuationPractice";
import EmergencyContacts from "@/pages/student/EmergencyContacts";
import EmergencyCenter from "@/pages/student/EmergencyCenter";
import VirtualDrillSimulator from "@/pages/student/VirtualDrillSimulator";
import MultiDisasterModules from "@/pages/student/MultiDisasterModules";

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
        <Route path="student/modules" element={<MultiDisasterModules />} />
        <Route path="student/modules/:moduleId" element={<ModuleDetailNew />} />
        <Route path="student/virtual-drills" element={<VirtualDrillSimulator />} />
        <Route path="student/drills/:moduleId" element={<DrillSimulator />} />
        <Route path="student/emergency" element={<EmergencyCenter />} />
        <Route path="student/emergency-contacts" element={<EmergencyContacts />} />
        <Route path="student/campus-map" element={<CampusMap />} />
        <Route path="student/evacuation-practice" element={<EvacuationPractice />} />
        <Route path="student/profile" element={<StudentProfile />} />
        <Route path="student/ai-assistant" element={<AIAssistant />} />
        <Route path="student/profile" element={<StudentProfile />} />
        <Route path="student/ai-assistant" element={<AIAssistant />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/analytics-dashboard" element={<AdminAnalyticsDashboard />} />
        <Route path="admin/drill" element={<AdminDashboard />} />
        <Route path="admin/analytics" element={<AdminAnalytics />} />
        <Route path="admin/ai-assistant" element={<AIAssistant />} />

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
          <AIProvider>
            <AppContent />
          </AIProvider>
        </AppProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
