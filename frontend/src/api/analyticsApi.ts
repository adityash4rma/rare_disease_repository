import apiClient from './apiClient';
import type { DashboardStats, DiseaseDistributionItem, AnalyticsResponse } from '../types/api';

export const analyticsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/api/analytics/dashboard');
    return response.data;
  },

  getDiseaseDistribution: async (limit = 10): Promise<DiseaseDistributionItem[]> => {
    const response = await apiClient.get<DiseaseDistributionItem[]>(`/api/analytics/diseases?limit=${limit}`);
    return response.data;
  },

  getAllAnalytics: async (): Promise<AnalyticsResponse> => {
    const response = await apiClient.get<AnalyticsResponse>('/api/analytics/all');
    return response.data;
  }
};
