export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Sales User';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: 'Website' | 'Instagram' | 'Referral';
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface LeadsResponse {
  success: boolean;
  message: string;
  data: Lead[];
  pagination: PaginationData;
}

export interface StatsResponse {
  success: boolean;
  data: {
    totalLeads: number;
    newLeads: number;
    qualifiedLeads: number;
    lostLeads: number;
  };
}
