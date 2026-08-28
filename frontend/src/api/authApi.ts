import apiClient from './apiClient';
import type { UserLogin, UserRegister, TokenResponse, User } from '../types/api';

export const authApi = {
  login: async (credentials: UserLogin): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: UserRegister): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/api/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/auth/me');
    return response.data;
  }
};