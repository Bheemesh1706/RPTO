export type LeadStatus = 'New' | 'Contacted' | 'Converted' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  age: string | number;
  phone: string;
  email: string;
  place: string;
  status: LeadStatus;
  image_url: string;
  remarks: string;
  created_at: string; // ISO string
}

