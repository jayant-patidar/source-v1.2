import api from '../api/api';

export interface Job {
  _id: string;
  title: string;
  description: string;
  originalPay: number;
  currentPay?: number;
  location: {
    general: string;
    exact: string;
  };
  jobDate: string;
  jobTime: string;
  status: string;
  tags?: string[];
  requirements?: string[]; // Match web
  seekerId: {
    _id: string;
    name: string; // Correct field from backend User model
    avatar?: string;
    seekerRating?: number;
  };
  createdAt: string;
}

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await api.get('/jobs');
  return response.data;
};

export const searchJobs = async (query: string): Promise<Job[]> => {
  const response = await api.get('/jobs', { params: { search: query } });
  return response.data;
};
