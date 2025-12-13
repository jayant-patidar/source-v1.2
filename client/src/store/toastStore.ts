
import { create } from 'zustand';

interface ToastState {
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
  open: boolean;
  showToast: (message: string, severity?: 'success' | 'error' | 'info' | 'warning') => void;
  hideToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: '',
  severity: 'success', // Default
  open: false,

  showToast: (message, severity = 'success') => 
    set({ open: true, message, severity }),

  hideToast: () => 
    set({ open: false }),
}));
