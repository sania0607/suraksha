import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, type User } from '../services/authService';
import { modulesService, type DisasterModule, type StudentProgress } from '../services/modulesService';
import { emergencyService, type EmergencyAlert } from '../services/emergencyService';

// Types
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  modules: DisasterModule[];
  userProgress: StudentProgress[];
  emergencyAlerts: EmergencyAlert[];
  students: any[];
  drillActive: boolean;
  error: string | null;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  loadModules: () => Promise<void>;
  updateModuleProgress: (progress: StudentProgress) => void;
  triggerSOS: () => void;
  setDrillActive: (active: boolean) => void;
  updateStudentScore: (studentId: string, score: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

// Mock data for compatibility
const mockStudents = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@university.edu',
    preparednessScore: 85,
    completedModules: ['earthquake', 'fire'],
    lastActive: '2024-01-15T10:30:00Z',
  },
  {
    id: '2', 
    name: 'Bob Smith',
    email: 'bob@university.edu',
    preparednessScore: 72,
    completedModules: ['flood'],
    lastActive: '2024-01-14T15:45:00Z',
  }
];

const mockModules: DisasterModule[] = [
  {
    id: 'earthquake',
    title: 'Earthquake Preparedness',
    description: 'Learn how to prepare for and respond to earthquakes',
    disaster_type: 'earthquake',
    difficulty_level: 'beginner',
    estimated_duration: 30,
    is_active: true,
    order_index: 1,
    slug: 'earthquake-preparedness',
    phases: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fire',
    title: 'Fire Safety',
    description: 'Essential fire safety knowledge and evacuation procedures',
    disaster_type: 'fire',
    difficulty_level: 'beginner',
    estimated_duration: 25,
    is_active: true,
    order_index: 2,
    slug: 'fire-safety',
    phases: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    modules: mockModules,
    userProgress: [],
    emergencyAlerts: [],
    students: mockStudents,
    drillActive: false,
    error: null,
  });

  console.log('AppProvider state:', { 
    isAuthenticated: state.isAuthenticated, 
    user: state.user,
    isLoading: state.isLoading 
  });

  const login = async (email: string, password: string) => {
    console.log('🚀 Login attempt:', { email, password });
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Try real authentication first
      let user: User | null = null;
      try {
        const authResponse = await authService.login({ email, password });
        user = {
          ...authResponse.user,
          role: authResponse.user.role as 'student' | 'admin'
        };
        console.log('✅ Real authentication successful:', user);
      } catch (apiError) {
        console.log('⚠️ Real API failed, trying mock authentication:', apiError);
        
        // Fallback to mock authentication
        if (email === 'student@suraksha.edu' && password === 'demo123') {
          user = {
            id: '1',
            name: 'Demo Student',
            email: 'student@suraksha.edu',
            role: 'student',
            is_active: true
          };
        } else if (email === 'admin@suraksha.edu' && password === 'admin123') {
          user = {
            id: '2',
            name: 'Demo Admin',
            email: 'admin@suraksha.edu',
            role: 'admin',
            is_active: true
          };
        }
      }

      if (user) {
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
        console.log('✅ Login successful, state updated:', { user, isAuthenticated: true });
        console.log('🔄 Current window location:', window.location.pathname);
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid credentials'
        }));
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed. Please try again.'
      }));
    }
  };

  const register = async (data: any) => {
    console.log('Register attempt:', data);
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const authResponse = await authService.register(data);
      const user: User = {
        ...authResponse.user,
        role: authResponse.user.role as 'student' | 'admin'
      };
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }));
    } catch (error) {
      console.error('Registration error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Registration failed. Please try again.'
      }));
    }
  };

  const logout = () => {
    authService.logout();
    setState(prev => ({
      ...prev,
      user: null,
      isAuthenticated: false,
      error: null
    }));
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  const loadModules = async () => {
    try {
      // Use mock modules for now since API structure is not fully defined
      setState(prev => ({ ...prev, modules: mockModules }));
    } catch (error) {
      console.error('Failed to load modules:', error);
      // Use mock modules on error
    }
  };

  const updateModuleProgress = (progress: StudentProgress) => {
    setState(prev => ({
      ...prev,
      userProgress: [...prev.userProgress.filter(p => p.module_id !== progress.module_id), progress]
    }));
  };

  const triggerSOS = () => {
    console.log('SOS triggered');
  };

  const setDrillActive = (active: boolean) => {
    setState(prev => ({ ...prev, drillActive: active }));
  };

  const updateStudentScore = (studentId: string, score: number) => {
    setState(prev => ({
      ...prev,
      students: prev.students.map(student =>
        student.id === studentId ? { ...student, preparednessScore: score } : student
      )
    }));
  };

  // Initialize on mount
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app...');
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const user = await authService.getCurrentUser();
          setState(prev => ({
            ...prev,
            user,
            isAuthenticated: true,
            isLoading: false
          }));
        } catch (error) {
          console.log('Token validation failed:', error);
          localStorage.removeItem('token');
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeApp();
  }, []);

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
        loadModules,
        updateModuleProgress,
        triggerSOS,
        setDrillActive,
        updateStudentScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;