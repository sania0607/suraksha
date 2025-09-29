// Authentication Service
import apiClient from './api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'student' | 'admin';
  student_id?: string;
  department?: string;
  year_of_study?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    is_active: boolean;
    student_id?: string;
    department?: string;
    year_of_study?: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  is_active: boolean;
  student_id?: string;
  department?: string;
  year_of_study?: string;
  created_at?: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    // Send JSON payload instead of FormData
    const response = await apiClient.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { access_token, refresh_token } = response.data;

    // Store tokens
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    
    // Since the backend only returns tokens, we need to get user info separately
    // For now, create a mock user object based on the email
    const mockUser = {
      id: '1',
      email: credentials.email,
      name: credentials.email.includes('admin') ? 'Admin User' : 'Student User',
      role: credentials.email.includes('admin') ? 'admin' : 'student',
      is_active: true,
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));

    return {
      access_token,
      refresh_token,
      user: mockUser
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', userData);

    const { access_token, refresh_token, user } = response.data;

    // Store tokens
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });

    const { access_token } = response.data;
    localStorage.setItem('access_token', access_token);

    return access_token;
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
}

export const authService = new AuthService();