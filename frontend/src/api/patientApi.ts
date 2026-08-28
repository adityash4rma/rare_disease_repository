import apiClient from './apiClient';
import type { Patient, PatientListResponse } from '../types/api';

export const patientApi = {
  getPatients: async (
    search?: string,
    page = 1,
    pageSize = 15,
    sex?: string,
    hospitalId?: string
  ): Promise<PatientListResponse> => {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('page_size', pageSize.toString());
    if (sex && sex !== 'All' && sex !== 'All Sexes') params.append('sex', sex.toLowerCase());
    if (hospitalId) params.append('hospital_id', hospitalId);

    const response = await apiClient.get<any>(`/api/patients?${params.toString()}`);
    const data = response.data;
    const rawList = data?.items || data?.patients || (Array.isArray(data) ? data : []);

    const patientList: Patient[] = rawList.map((item: any) => {
      let age = item.age;
      if (typeof age !== 'number' && item.date_of_birth) {
        const birthYear = new Date(item.date_of_birth).getFullYear();
        age = isNaN(birthYear) ? 28 : (2026 - birthYear);
      }
      return {
        id: item.id,
        patient_code: item.mrn || item.patient_code || `IND-RDR-${String(item.id).slice(0, 4)}`,
        first_name: item.first_name || '',
        last_name: item.last_name || '',
        age: age || 28,
        sex: (item.sex || 'Unknown').charAt(0).toUpperCase() + (item.sex || 'unknown').slice(1).toLowerCase(),
        ethnicity: item.ethnicity || 'Indo-Aryan',
        city: item.address_city || item.city || 'Delhi NCR',
        country: item.address_country || item.country || 'India',
        hospital_id: item.hospital_id,
        hospital_name: item.hospital_name || (item.hospital_id ? `Hospital #${String(item.hospital_id).slice(0, 8)}` : 'AIIMS New Delhi'),
        hospital_code: item.hospital_code,
        created_at: item.created_at || new Date().toISOString(),
      };
    });

    return {
      patients: patientList,
      total: data?.total ?? patientList.length,
      page: data?.page ?? page,
      pageSize: data?.page_size ?? pageSize,
    };
  },

  getPatientById: async (id: number | string): Promise<Patient> => {
    const response = await apiClient.get<Patient>(`/api/patients/${id}`);
    return response.data;
  }
};
