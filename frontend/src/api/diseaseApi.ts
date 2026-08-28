import apiClient from './apiClient';
import type { Disease, DiseaseListResponse } from '../types/api';

export const diseaseApi = {
  getAllDiseases: async (search?: string, category?: string, limit = 50): Promise<DiseaseListResponse> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit.toString());

    const response = await apiClient.get<any>(`/api/diseases?${params.toString()}`);
    const data = response.data;
    const diseaseList = data.items || data.diseases || [];
    return {
      diseases: diseaseList,
      total: data.total ?? diseaseList.length,
    };
  },

  getDiseaseById: async (id: string | number): Promise<Disease> => {
    const response = await apiClient.get<Disease>(`/api/diseases/${id}`);
    return response.data;
  },

  createDisease: async (diseaseData: Partial<Disease>): Promise<Disease> => {
    const response = await apiClient.post<Disease>('/api/diseases', diseaseData);
    return response.data;
  }
};