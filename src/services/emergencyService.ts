// Emergency Services
import apiClient from './api';

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  alert_type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  location?: string;
  is_active: boolean;
  created_by_id: string;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface SOSRequest {
  id: string;
  user_id: string;
  location: string;
  latitude?: number;
  longitude?: number;
  message?: string;
  status: 'ACTIVE' | 'RESPONDED' | 'RESOLVED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  created_at: string;
  updated_at: string;
  responded_at?: string;
  resolved_at?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  organization: string;
  phone: string;
  email?: string;
  contact_type: string;
  is_primary: boolean;
  is_active: boolean;
  description?: string;
  created_at: string;
}

export interface WeatherAlert {
  id: string;
  location: string;
  latitude: number;
  longitude: number;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  weather_data: any;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
}

class EmergencyService {
  // Emergency Alerts
  async getActiveAlerts(): Promise<EmergencyAlert[]> {
    const response = await apiClient.get('/emergency/alerts/active');
    return response.data;
  }

  async getAllAlerts(): Promise<EmergencyAlert[]> {
    const response = await apiClient.get('/emergency/alerts');
    return response.data;
  }

  async createAlert(alertData: {
    title: string;
    message: string;
    alert_type: string;
    severity: string;
    location?: string;
    expires_at?: string;
  }): Promise<EmergencyAlert> {
    const response = await apiClient.post('/emergency/alerts', alertData);
    return response.data;
  }

  async updateAlert(alertId: string, alertData: Partial<EmergencyAlert>): Promise<EmergencyAlert> {
    const response = await apiClient.put(`/emergency/alerts/${alertId}`, alertData);
    return response.data;
  }

  async deactivateAlert(alertId: string): Promise<void> {
    await apiClient.put(`/emergency/alerts/${alertId}/deactivate`);
  }

  // SOS Requests
  async createSOSRequest(sosData: {
    location: string;
    latitude?: number;
    longitude?: number;
    message?: string;
    priority?: string;
  }): Promise<SOSRequest> {
    const response = await apiClient.post('/emergency/sos', sosData);
    return response.data;
  }

  async getMySOSRequests(): Promise<SOSRequest[]> {
    const response = await apiClient.get('/emergency/sos/my');
    return response.data;
  }

  async getAllSOSRequests(): Promise<SOSRequest[]> {
    const response = await apiClient.get('/emergency/sos');
    return response.data;
  }

  async updateSOSStatus(sosId: string, status: string): Promise<SOSRequest> {
    const response = await apiClient.put(`/emergency/sos/${sosId}/status`, { status });
    return response.data;
  }

  // Emergency Contacts
  async getEmergencyContacts(): Promise<EmergencyContact[]> {
    const response = await apiClient.get('/emergency/contacts');
    return response.data;
  }

  async createEmergencyContact(contactData: {
    name: string;
    organization: string;
    phone: string;
    email?: string;
    contact_type: string;
    is_primary?: boolean;
    description?: string;
  }): Promise<EmergencyContact> {
    const response = await apiClient.post('/emergency/contacts', contactData);
    return response.data;
  }

  async updateEmergencyContact(contactId: string, contactData: Partial<EmergencyContact>): Promise<EmergencyContact> {
    const response = await apiClient.put(`/emergency/contacts/${contactId}`, contactData);
    return response.data;
  }

  async deleteEmergencyContact(contactId: string): Promise<void> {
    await apiClient.delete(`/emergency/contacts/${contactId}`);
  }

  // Weather Alerts
  async getWeatherAlerts(): Promise<WeatherAlert[]> {
    const response = await apiClient.get('/emergency/weather-alerts');
    return response.data;
  }

  async getActiveWeatherAlerts(): Promise<WeatherAlert[]> {
    const response = await apiClient.get('/emergency/weather-alerts/active');
    return response.data;
  }

  // Real-time updates (WebSocket would be implemented here)
  subscribeToAlerts(callback: (alert: EmergencyAlert) => void): () => void {
    // WebSocket implementation for real-time alerts
    const ws = new WebSocket(`ws://localhost:8000/ws`);
    
    ws.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      callback(alert);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }
}

export const emergencyService = new EmergencyService();