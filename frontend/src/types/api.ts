export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'admin' | 'researcher' | 'clinician';
  hospital_id?: number | null;
  is_active: boolean;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  full_name: string;
  role?: string;
  hospital_id?: number;
}

export interface Disease {
  id: number;
  name: string;
  orpha_code?: string;
  icd10_code?: string;
  description?: string;
  symptoms?: string[];
  genes?: string[];
  category?: string;
  inheritance_pattern?: string;
  patient_count?: number;
  dataset_count?: number;
  created_at?: string;
}

export interface DiseaseListResponse {
  diseases: Disease[];
  total: number;
}

export interface Patient {
  id: string | number;
  patient_code: string;
  first_name?: string;
  last_name?: string;
  age: number;
  sex: string;
  ethnicity: string;
  city: string;
  country: string;
  hospital_id?: string | number;
  hospital_name?: string;
  hospital_code?: string;
  created_at: string;
}

export interface PatientListResponse {
  patients: Patient[];
  total: number;
  page?: number;
  pageSize?: number;
}

export interface Hospital {
  id: number;
  name: string;
  code: string;
  city: string;
  country: string;
  patient_count?: number;
  data_sharing_status?: string;
}

export interface HospitalListResponse {
  hospitals: Hospital[];
  total: number;
}

export interface Contribution {
  id: number;
  hospital_id: number;
  hospital_name?: string;
  record_type: string;
  record_count: number;
  status: string;
  submitted_by_id?: number;
  created_at: string;
}

export interface ContributionListResponse {
  contributions: Contribution[];
  total: number;
}

export interface FHIRResource {
  id: number;
  resource_type: string;
  fhir_id: string;
  patient_id?: number;
  payload: Record<string, any>;
  created_at: string;
}

export interface DashboardStats {
  total_diseases: number;
  total_patients: number;
  total_hospitals: number;
  total_contributions: number;
  total_fhir_resources: number;
  active_studies?: number;
}

export interface DiseaseDistributionItem {
  disease_name: string;
  patient_count: number;
  percentage: number;
}

export interface AnalyticsResponse {
  stats: DashboardStats;
  top_diseases: DiseaseDistributionItem[];
}
