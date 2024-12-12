import { create } from 'zustand';
import { UIState } from './ui.state';

/**
 * @constant useUiStore
 * @description Custom hook for managing UI state using Zustand
 *
 * @example
 * // Show loading indicator
 * const { showLoading } = useUiStore();
 * showLoading();
 *
 * // Hide loading indicator
 * const { hideLoading } = useUiStore();
 * hideLoading();
 *
 * // Show vertical navbar
 * const { showVerticalNavbar } = useUiStore();
 * showVerticalNavbar();
 *
 * // Hide vertical navbar
 * const { hideVerticalNavbar } = useUiStore();
 * hideVerticalNavbar();
 *
 * // Reset UI state
 * const { reset } = useUiStore();
 * reset();
 *
 * @returns {UIState} UI state and mutation methods
 */
export const useUiStore = create<UIState>((set, get) => ({
  loadingCount: 0,
  isLoading: false,
  isVerticalNavarOpen: false,

  showLoading: () =>
    set(state => ({
      loadingCount: state.loadingCount + 1,
      isLoading: true,
    })),

  hideLoading: () =>
    set(state => {
      const newCount = Math.max(0, state.loadingCount - 1);
      return {
        loadingCount: newCount,
        isLoading: newCount > 0,
      };
    }),

  showVerticalNavbar: () => set({ isVerticalNavarOpen: true }),
  hideVerticalNavbar: () => set({ isVerticalNavarOpen: false }),

  reset: () => {
    get().hideLoading();
    get().hideVerticalNavbar();
  },
}));
