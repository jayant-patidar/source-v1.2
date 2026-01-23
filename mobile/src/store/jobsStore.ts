import { create } from 'zustand';
import { Job, fetchJobs } from '../services/jobs.service';

interface JobsState {
  jobs: Job[];
  isLoading: boolean;
  error: string | null;
  loadJobs: () => Promise<void>;
}

export const useJobsStore = create<JobsState>((set) => ({
  jobs: [],
  isLoading: false,
  error: null,
  loadJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchJobs();
      set({ jobs: data, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch jobs', 
        isLoading: false 
      });
    }
  },
}));
