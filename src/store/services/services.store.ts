import { create } from 'zustand';
import { ServicesState } from './services.state';

/**
 * @constant useServicesStore
 * @description Custom hook for managing services state using Zustand
 *
 * @example
 * // Access and update services
 * const { services, setServices } = useServicesStore();
 * setServices(newServices);
 *
 * // Access and update service types
 * const { serviceTypes, setServiceTypes } = useServicesStore();
 * setServiceTypes(newServiceTypes);
 *
 * // Reset specific state
 * const { resetServices, resetServiceTypes } = useServicesStore();
 * resetServices();
 *
 * // Reset entire state
 * const { reset } = useServicesStore();
 * reset();
 *
 * @returns {ServicesState} Services state and mutation methods
 */
export const useServicesStore = create<ServicesState>((set, get) => ({
  services: undefined,
  history: undefined,
  serviceTypes: undefined,

  setServices: services => set({ services }),
  resetServices: () => set({ services: undefined }),

  setHistory: history => set({ history }),
  resetHistory: () => set({ history: undefined }),

  setServiceTypes: serviceTypes => set({ serviceTypes }),
  resetServiceTypes: () => set({ serviceTypes: undefined }),

  reset: () => {
    get().resetServices();
    get().resetServiceTypes();
    get().resetHistory();
  },
}));
