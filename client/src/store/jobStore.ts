import { create } from 'zustand';
import axios from 'axios';

interface Job {
  _id: string;
  title: string;
  description: string;
  originalPay: number;
  type: string;
  location: {
    general: string;
    exact: string;
  };
  jobDate: string;
  jobTime: string;
  category: string;
  createdAt: string;
  category: string;
  createdAt: string;
  seekerId: {
    _id: string;
    name: string;
    seekerRating: number;
    providerRating: number;
    avatar?: string;
  };
}

interface JobState {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: (filters?: any) => Promise<void>;
  createJob: (jobData: any) => Promise<void>;
}

const API_URL = 'http://localhost:5000/api/jobs';
const api = axios.create({ baseURL: API_URL, withCredentials: true });

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  isLoading: false,
  error: null,
  fetchJobs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      // Clean up filters (remove empty/null values)
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v != null && v !== '')
      );
      const { data } = await api.get('/', { params });
      set({ jobs: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false, jobs: [] });
    }
  },
  createJob: async (jobData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/', jobData);
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
