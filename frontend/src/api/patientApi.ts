import apiClient from './apiClient';
import type { Patient, PatientListResponse } from '../types/api';

export const patientApi = {
  getPatients: async (search?: string, diseaseId?: number, limit = 50): Promise<PatientListResponse> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (diseaseId) params.append('disease_id', diseaseId.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await apiClient.get<PatientListResponse>(`/api/patients?${params.toString()}`);
    return response.data;
  },

  getPatientById: async (id: number | string): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/api/patients/${id}`);
    return response.data;
  }
};
