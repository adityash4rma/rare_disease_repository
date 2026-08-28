import apiClient from './apiClient';
import type { Patient, PatientListResponse } from '../types/api';

export const patientApi = {
  getPatients: async (search?: string, diseaseId?: number | string, limit = 50): Promise<PatientListResponse> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (diseaseId) params.append('disease_id', diseaseId.toString());
    if (limit) params.append('limit', limit.toString());

    const response = await apiClient.get<any>(`/api/patients?${params.toString()}`);
    const data = response.data;
    const patientList = data.items || data.patients || [];
    return {
      patients: patientList,
      total: data.total ?? patientList.length,
    };
  },

  getPatientById: async (id: number | string): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/api/patients/${id}`);
    return response.data;
  }
};
