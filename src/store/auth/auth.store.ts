import { create } from 'zustand';
import { AuthState } from './auth.state';

/**
 * @constant
 * @description Zustand store hook for authentication state management
 *
 * @example
 * const { user, setUser, permissions } = useAuthStore();
 *
 * // Set user
 * setUser(newUser);
 *
 * // Check permissions
 * if (permissions?.includes('admin')) {
 *   // Handle admin access
 * }
 *
 * @returns {AuthState} Authentication state and actions
 */
export const useAuthStore = create<AuthState>()((set, get) => ({
  user: undefined,
  permissions: undefined,

  setUser: user => set({ user }),
  resetUser: () => set({ user: undefined }),

  setPermissions: permissions => set({ permissions }),
  resetPermissions: () => set({ permissions: undefined }),

  reset: () => {
    get().resetUser();
    get().resetPermissions();
  },
}));
