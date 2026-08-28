import apiClient from './apiClient';
import type { FHIRResource } from '../types/api';

export const fhirApi = {
  getResources: async (resourceType?: string, patientId?: number): Promise<FHIRResource[]> => {
    const params = new URLSearchParams();
    if (resourceType) params.append('resource_type', resourceType);
    if (patientId) params.append('patient_id', patientId.toString());

    const response = await apiClient.get<FHIRResource[]>(`/api/fhir/resources?${params.toString()}`);
    return response.data;
  },

  getSummary: async (): Promise<Record<string, number>> => {
    const response = await apiClient.get<Record<string, number>>('/api/fhir/resources/summary');
    return response.data;
  }
};
