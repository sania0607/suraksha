import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, type User } from '../services/authService';
import { modulesService, type DisasterModule, type StudentProgress } from '../services/modulesService';
import { emergencyService, type EmergencyAlert } from '../services/emergencyService';

// Types
interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Modules
  modules: DisasterModule[];
  userProgress: StudentProgress[];
  
  // Emergency
  emergencyAlerts: EmergencyAlert[];
  
  // Admin/Mock data for compatibility
  students: any[];
  drillActive: boolean;
  
  // UI
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_MODULES'; payload: DisasterModule[] }
  | { type: 'SET_USER_PROGRESS'; payload: StudentProgress[] }
  | { type: 'UPDATE_MODULE_PROGRESS'; payload: StudentProgress }
  | { type: 'SET_EMERGENCY_ALERTS'; payload: EmergencyAlert[] }
  | { type: 'ADD_EMERGENCY_ALERT'; payload: EmergencyAlert }
  | { type: 'SET_DRILL_ACTIVE'; payload: boolean }
  | { type: 'LOGOUT' };

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  modules: [],
  userProgress: [],
  emergencyAlerts: [],
  students: [],
  drillActive: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
    
    case 'SET_MODULES':
      return { ...state, modules: action.payload };
    
    case 'SET_USER_PROGRESS':
      return { ...state, userProgress: action.payload };
    
    case 'UPDATE_MODULE_PROGRESS':
      return {
        ...state,
        userProgress: state.userProgress.map(progress =>
          progress.module_id === action.payload.module_id
            ? action.payload
            : progress
        ).concat(
          state.userProgress.some(p => p.module_id === action.payload.module_id)
            ? []
            : [action.payload]
        ),
      };
    
    case 'SET_EMERGENCY_ALERTS':
      return { ...state, emergencyAlerts: action.payload };
    
    case 'ADD_EMERGENCY_ALERT':
      return {
        ...state,
        emergencyAlerts: [action.payload, ...state.emergencyAlerts],
      };
    
    case 'SET_DRILL_ACTIVE':
      return { ...state, drillActive: action.payload };
    
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      };
    
    default:
      return state;
  }
}

// Context
interface AppContextValue extends AppState {
  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    student_id?: string;
    department?: string;
    year_of_study?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  
  // Module actions
  loadModules: () => Promise<void>;
  loadUserProgress: () => Promise<void>;
  startModule: (moduleId: string) => Promise<void>;
  updateModuleProgress: (
    moduleId: string,
    phaseId?: string,
    stepId?: string,
    completed?: boolean,
    score?: number
  ) => Promise<void>;
  
  // Emergency actions
  loadEmergencyAlerts: () => Promise<void>;
  createSOSRequest: (location: string, message?: string) => Promise<void>;
  
  // Admin/Compatibility actions
  setDrillActive: (active: boolean) => void;
  triggerSOS: () => void;
  updateStudentScore: (studentId: string, moduleId: string, score: number) => void;
  
  // Utility
  clearError: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  // Subscribe to emergency alerts
  useEffect(() => {
    if (state.isAuthenticated) {
      const unsubscribe = emergencyService.subscribeToAlerts((alert) => {
        dispatch({ type: 'ADD_EMERGENCY_ALERT', payload: alert });
      });

      return unsubscribe;
    }
  }, [state.isAuthenticated]);

  const initializeApp = async () => {
    try {
      console.log('Initializing app...');
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Check if user is already authenticated
      const isAuth = authService.isAuthenticated();
      console.log('Is authenticated:', isAuth);
      
      if (isAuth) {
        const user = authService.getCurrentUser();
        console.log('Current user:', user);
        if (user) {
          dispatch({ type: 'SET_USER', payload: { ...user, role: user.role as 'student' | 'admin' } });
          
          // Load initial data only for authenticated users
          console.log('Loading user data...');
          try {
            await Promise.all([
              loadModules(),
              loadUserProgress(),
              loadEmergencyAlerts(),
            ]);
          } catch (dataError) {
            console.error('Error loading user data:', dataError);
            // Don't throw, continue initialization
          }
        }
      }
      console.log('App initialization complete');
    } catch (error) {
      console.error('App initialization error:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize app' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await authService.login({ email, password });
      dispatch({ type: 'SET_USER', payload: { ...response.user, role: response.user.role as 'student' | 'admin' } });

      // Load user data
      await Promise.all([
        loadModules(),
        loadUserProgress(),
        loadEmergencyAlerts(),
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    student_id?: string;
    department?: string;
    year_of_study?: string;
  }) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await authService.register({
        ...userData,
        role: 'student',
      });
      
      dispatch({ type: 'SET_USER', payload: { ...response.user, role: response.user.role as 'student' | 'admin' } });

      // Load user data
      await Promise.all([
        loadModules(),
        loadUserProgress(),
        loadEmergencyAlerts(),
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const loadModules = async () => {
    try {
      const modules = await modulesService.getAllModules();
      dispatch({ type: 'SET_MODULES', payload: modules });
    } catch (error) {
      console.error('Error loading modules:', error);
    }
  };

  const loadUserProgress = async () => {
    try {
      const progress = await modulesService.getUserProgress();
      dispatch({ type: 'SET_USER_PROGRESS', payload: progress });
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const startModule = async (moduleId: string) => {
    try {
      const progress = await modulesService.startModule(moduleId);
      dispatch({ type: 'UPDATE_MODULE_PROGRESS', payload: progress });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to start module';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateModuleProgress = async (
    moduleId: string,
    phaseId?: string,
    stepId?: string,
    completed?: boolean,
    score?: number
  ) => {
    try {
      const progress = await modulesService.updateProgress(
        moduleId,
        phaseId,
        stepId,
        completed,
        score
      );
      dispatch({ type: 'UPDATE_MODULE_PROGRESS', payload: progress });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update progress';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const loadEmergencyAlerts = async () => {
    try {
      const alerts = await emergencyService.getActiveAlerts();
      dispatch({ type: 'SET_EMERGENCY_ALERTS', payload: alerts });
    } catch (error) {
      console.error('Error loading emergency alerts:', error);
    }
  };

  const createSOSRequest = async (location: string, message?: string) => {
    try {
      await emergencyService.createSOSRequest({
        location,
        message,
        priority: 'HIGH',
      });
      
      // Optionally refresh alerts or show confirmation
      await loadEmergencyAlerts();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to send SOS request';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const setDrillActive = (active: boolean) => {
    dispatch({ type: 'SET_DRILL_ACTIVE', payload: active });
  };

  const triggerSOS = () => {
    // Mock SOS functionality - in real app this would trigger emergency protocols
    console.log('SOS triggered!');
    createSOSRequest('Current location', 'Emergency SOS activated');
  };

  const updateStudentScore = (studentId: string, moduleId: string, score: number) => {
    // Mock function for compatibility - in real app this would update student scores via API
    console.log('Student score updated:', { studentId, moduleId, score });
  };

  const contextValue: AppContextValue = {
    ...state,
    login,
    register,
    logout,
    loadModules,
    loadUserProgress,
    startModule,
    updateModuleProgress,
    loadEmergencyAlerts,
    createSOSRequest,
    setDrillActive,
    triggerSOS,
    updateStudentScore,
    clearError,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}