import apiClient from './apiClient';

export const diseaseApi = {
  // 1. Get all diseases (for the Explore page)
  getAllDiseases: async () => {
    const response = await apiClient.get('/api/v1/diseases');
    return response.data;
  },

  // 2. Get details for one disease (for the Detail page)
  getDiseaseById: async (id: string) => {
    const response = await apiClient.get(`/api/v1/diseases/${id}`);
    return response.data;
  },

  // 3. Search for diseases
  searchDiseases: async (query: string) => {
    const response = await apiClient.get(`/api/v1/search?q=${query}`);
    return response.data;
  }
};