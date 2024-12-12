import { User } from '@/interfaces';

/**
 * @interface AuthState
 * @description Interface defining the authentication state and its actions
 */
export interface AuthState {
  /** Current authenticated user */
  user?: User;
  /** User permissions array ['superAdmin', 'admin', 'receptionist', 'worker', 'client'] */
  permissions?: string[];

  /**
   * @function setUser
   * @description Sets the current authenticated user
   * @param {User} user - User object to set
   */
  setUser: (user: User) => void;

  /**
   * @function resetUser
   * @description Removes the current user from state
   */
  resetUser: () => void;

  /**
   * @function setPermissions
   * @description Sets user permissions array
   * @param {string[]} permissions - Array of permission strings
   */
  setPermissions: (permissions: string[]) => void;

  /**
   * @function resetPermissions
   * @description Removes all user permissions
   */
  resetPermissions: () => void;

  /**
   * @function reset
   * @description Resets entire auth state
   */
  reset: () => void;
}
