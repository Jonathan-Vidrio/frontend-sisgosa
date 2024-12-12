import { create } from 'zustand';
import { AppointmentsState } from './appointments.state';

/**
 * @constant
 * @description Zustand store hook for appointments state management
 *
 * @example
 * const { appointments, setAppointments } = useAppointmentsStore();
 *
 * @returns {AppointmentsState} Appointments state and actions
 */
export const useAppointmentsStore = create<AppointmentsState>((set, get) => ({
  appointments: undefined,
  history: undefined,

  setAppointments: appointments => set({ appointments }),
  resetAppointments: () => set({ appointments: undefined }),

  setHistory: history => set({ history }),
  resetHistory: () => set({ history: undefined }),

  reset: () => get().resetAppointments(),
}));
