import { create } from 'zustand';
import { StatusesState } from './statuses.state';

/**
 * @constant useStatusesStore
 * @description Custom hook for managing statuses state using Zustand
 *
 * @example
 * // Access and update statuses
 * const { statuses, setStatuses } = useStatusesStore();
 * setStatuses(newStatuses);
 *
 * // Reset statuses
 * const { resetStatuses } = useStatusesStore();
 * resetStatuses();
 *
 * // Reset entire state
 * const { reset } = useStatusesStore();
 * reset();
 *
 * @returns {StatusesState} Statuses state and mutation methods
 */
export const useStatusesStore = create<StatusesState>((set, get) => ({
  statuses: undefined,

  setStatuses: statuses => set({ statuses }),
  resetStatuses: () => set({ statuses: undefined }),

  reset: () => {
    get().resetStatuses();
  },
}));
