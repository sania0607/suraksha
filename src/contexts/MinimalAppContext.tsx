import React, { createContext, useContext, useState, useEffect } from 'react';

// Minimal types for testing
interface MinimalUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

interface MinimalAppState {
  user: MinimalUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface MinimalAppContextType extends MinimalAppState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const MinimalAppContext = createContext<MinimalAppContextType | null>(null);

export const useMinimalApp = () => {
  const context = useContext(MinimalAppContext);
  if (!context) {
    throw new Error('useMinimalApp must be used within MinimalAppProvider');
  }
  return context;
};

export const MinimalAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<MinimalAppState>({
    user: null,
    isAuthenticated: false,
    isLoading: false, // Start with false to avoid loading screen
    error: null,
  });

  console.log('MinimalAppProvider state:', state);

  const login = async (email: string, password: string) => {
    console.log('🚀 LOGIN FUNCTION CALLED:', { email, password });
    alert(`Login function called with email: ${email}`);
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('Checking credentials...');
      // Mock successful login
      if (email === 'student@suraksha.edu' && password === 'demo123') {
        const mockUser: MinimalUser = {
          id: '1',
          name: 'Demo Student',
          email: 'student@suraksha.edu',
          role: 'student'
        };
        setState(prev => ({
          ...prev,
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
        console.log('Login successful:', mockUser);
      } else if (email === 'admin@suraksha.edu' && password === 'admin123') {
        const mockUser: MinimalUser = {
          id: '2',
          name: 'Demo Admin',
          email: 'admin@suraksha.edu',
          role: 'admin'
        };
        setState(prev => ({
          ...prev,
          user: mockUser,
          isAuthenticated: true,
          isLoading: false,
          error: null
        }));
        console.log('Login successful:', mockUser);
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Invalid credentials'
        }));
      }
    } catch (error) {
      console.error('Login error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Login failed'
      }));
    }
  };

  const logout = () => {
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <MinimalAppContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </MinimalAppContext.Provider>
  );
};

export default MinimalAppProvider;