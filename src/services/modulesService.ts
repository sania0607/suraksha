// Disaster Modules Service
import apiClient from './api';

export interface DisasterModule {
  id: string;
  title: string;
  description: string;
  disaster_type: string;
  difficulty_level: string;
  estimated_duration: number;
  is_active: boolean;
  order_index: number;
  slug: string;
  phases: ModulePhase[];
  created_at: string;
  updated_at: string;
}

export interface ModulePhase {
  id: string;
  title: string;
  description: string;
  phase_type: string;
  content: any;
  order_index: number;
  is_required: boolean;
  estimated_minutes: number;
  steps: PhaseStep[];
}

export interface PhaseStep {
  id: string;
  title: string;
  description: string;
  step_type: string;
  content: any;
  order_index: number;
  is_required: boolean;
}

export interface StudentProgress {
  id: string;
  module_id: string;
  user_id: string;
  current_phase_id?: string;
  current_step_id?: string;
  completed: boolean;
  score?: number;
  time_spent: number;
  started_at: string;
  completed_at?: string;
  last_accessed_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  module_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken: number;
  answers: any;
  started_at: string;
  completed_at: string;
}

class ModulesService {
  async getAllModules(): Promise<DisasterModule[]> {
    const response = await apiClient.get('/modules/');
    return response.data;
  }

  async getModule(moduleId: string): Promise<DisasterModule> {
    const response = await apiClient.get(`/modules/${moduleId}`);
    return response.data;
  }

  async getModuleBySlug(slug: string): Promise<DisasterModule> {
    const response = await apiClient.get(`/modules/slug/${slug}`);
    return response.data;
  }

  async getUserProgress(): Promise<StudentProgress[]> {
    const response = await apiClient.get('/modules/progress');
    return response.data;
  }

  async getModuleProgress(moduleId: string): Promise<StudentProgress | null> {
    try {
      const response = await apiClient.get(`/modules/${moduleId}/progress`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async startModule(moduleId: string): Promise<StudentProgress> {
    const response = await apiClient.post(`/modules/${moduleId}/start`);
    return response.data;
  }

  async updateProgress(
    moduleId: string,
    phaseId?: string,
    stepId?: string,
    completed = false,
    score?: number
  ): Promise<StudentProgress> {
    const response = await apiClient.put(`/modules/${moduleId}/progress`, {
      current_phase_id: phaseId,
      current_step_id: stepId,
      completed,
      score,
    });
    return response.data;
  }

  async submitQuiz(
    moduleId: string,
    answers: any,
    score: number,
    totalQuestions: number,
    correctAnswers: number,
    timeTaken: number
  ): Promise<QuizAttempt> {
    const response = await apiClient.post(`/modules/${moduleId}/quiz`, {
      answers,
      score,
      total_questions: totalQuestions,
      correct_answers: correctAnswers,
      time_taken: timeTaken,
    });
    return response.data;
  }

  async getQuizAttempts(moduleId: string): Promise<QuizAttempt[]> {
    const response = await apiClient.get(`/modules/${moduleId}/quiz/attempts`);
    return response.data;
  }

  // Admin methods
  async createModule(moduleData: Partial<DisasterModule>): Promise<DisasterModule> {
    const response = await apiClient.post('/modules/', moduleData);
    return response.data;
  }

  async updateModule(moduleId: string, moduleData: Partial<DisasterModule>): Promise<DisasterModule> {
    const response = await apiClient.put(`/modules/${moduleId}`, moduleData);
    return response.data;
  }

  async deleteModule(moduleId: string): Promise<void> {
    await apiClient.delete(`/modules/${moduleId}`);
  }
}

export const modulesService = new ModulesService();