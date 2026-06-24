import { create } from 'zustand';
import * as gigService from '../services/gig.service';

interface GigState {
  gigs: any[];
  myGigs: any[];
  currentGig: any | null;
  isLoading: boolean;
  error: string | null;
  fetchGigs: (filters?: any) => Promise<void>;
  fetchMyGigs: () => Promise<void>;
  fetchGigById: (id: string) => Promise<void>;
  createGig: (gigData: any) => Promise<void>;
  updateGig: (id: string, gigData: any) => Promise<void>;
  deleteGig: (id: string) => Promise<void>;
  bookGig: (id: string, bookingDetails: any) => Promise<any>;
}

export const useGigStore = create<GigState>((set) => ({
  gigs: [],
  myGigs: [],
  currentGig: null,
  isLoading: false,
  error: null,

  fetchGigs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await gigService.getGigs(filters);
      set({ gigs: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch gigs', isLoading: false });
    }
  },

  fetchMyGigs: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await gigService.getMyGigs();
      set({ myGigs: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch your gigs', isLoading: false });
    }
  },

  fetchGigById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await gigService.getGigById(id);
      set({ currentGig: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch gig details', isLoading: false });
    }
  },

  createGig: async (gigData: any) => {
    set({ isLoading: true, error: null });
    try {
      await gigService.createGig(gigData);
      set({ isLoading: false });
      // Re-fetch my gigs to update the list
      await useGigStore.getState().fetchMyGigs();
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create gig', isLoading: false });
      throw error;
    }
  },

  updateGig: async (id: string, gigData: any) => {
    set({ isLoading: true, error: null });
    try {
      await gigService.updateGig(id, gigData);
      set({ isLoading: false });
      await useGigStore.getState().fetchMyGigs();
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to update gig', isLoading: false });
      throw error;
    }
  },

  deleteGig: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await gigService.deleteGig(id);
      set({ isLoading: false });
      await useGigStore.getState().fetchMyGigs();
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to delete gig', isLoading: false });
      throw error;
    }
  },

  bookGig: async (id: string, bookingDetails: any) => {
    set({ isLoading: true, error: null });
    try {
      const job = await gigService.bookGig(id, bookingDetails);
      set({ isLoading: false });
      return job;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to book gig', isLoading: false });
      throw error;
    }
  },
}));
