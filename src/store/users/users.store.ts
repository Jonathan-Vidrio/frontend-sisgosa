import { create } from 'zustand';
import { UsersState } from './users.state';

/**
 * @constant useUsersStore
 * @description Custom hook for managing users state using Zustand
 *
 * @example
 * // Access and update users
 * const { users, setUsers } = useUsersStore();
 * setUsers(newUsers);
 *
 * // Access and update user types
 * const { userTypes, setUserTypes } = useUsersStore();
 * setUserTypes(newUserTypes);
 *
 * // Access and update workers
 * const { workers, setWorkers } = useUsersStore();
 * setWorkers(newWorkers);
 *
 * // Access and update worker types
 * const { workerTypes, setWorkerTypes } = useUsersStore();
 * setWorkerTypes(newWorkerTypes);
 *
 * // Access and update clients
 * const { clients, setClients } = useUsersStore();
 * setClients(newClients);
 *
 * // Reset specific state
 * const { resetUsers, resetUserTypes, resetWorkers, resetWorkerTypes, resetClients } = useUsersStore();
 * resetUsers();
 * resetUserTypes();
 * resetWorkers();
 * resetWorkerTypes();
 * resetClients();
 *
 * // Reset entire state
 * const { reset } = useUsersStore();
 * reset();
 *
 * @returns {UsersState} Users state and mutation methods
 */
export const useUsersStore = create<UsersState>((set, get) => ({
  users: undefined,
  userTypes: undefined,
  workers: undefined,
  workerTypes: undefined,
  clients: undefined,

  setUsers: users => set({ users }),
  resetUsers: () => set({ users: undefined }),

  setUserTypes: userTypes => set({ userTypes }),
  resetUserTypes: () => set({ userTypes: undefined }),

  setWorkers: workers => set({ workers }),
  resetWorkers: () => set({ workers: undefined }),

  setWorkerTypes: workerTypes => set({ workerTypes }),
  resetWorkerTypes: () => set({ workerTypes: undefined }),

  setClients: clients => set({ clients }),
  resetClients: () => set({ clients: undefined }),

  reset: () => {
    get().resetUsers();
    get().resetUserTypes();
    get().resetWorkers();
    get().resetWorkerTypes();
    get().resetClients();
  },
}));
