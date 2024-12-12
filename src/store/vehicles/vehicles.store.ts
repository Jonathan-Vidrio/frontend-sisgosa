import { create } from 'zustand';
import { VehiclesState } from './vehicles.state';

/**
 * @constant useVehiclesStore
 * @description Custom hook for managing vehicles state using Zustand
 *
 * @example
 * // Access and update vehicles
 * const { vehicles, setVehicles } = useVehiclesStore();
 * setVehicles(newVehicles);
 *
 * // Access and update vehicle brands
 * const { brands, setBrands } = useVehiclesStore();
 * setBrands(newBrands);
 *
 * // Access and update vehicle models
 * const { models, setModels } = useVehiclesStore();
 * setModels(newModels);
 *
 * // Reset specific state
 * const { resetVehicles, resetBrands, resetModels } = useVehiclesStore();
 * resetVehicles();
 * resetBrands();
 * resetModels();
 *
 * // Reset entire state
 * const { reset } = useVehiclesStore();
 * reset();
 *
 * @returns {VehiclesState} Vehicles state and mutation methods
 */
export const useVehiclesStore = create<VehiclesState>((set, get) => ({
  vehicles: undefined,
  brands: undefined,
  models: undefined,

  setBrands: brands => set({ brands }),
  resetBrands: () => set({ brands: [] }),

  setModels: models => set({ models }),
  resetModels: () => set({ models: [] }),

  setVehicles: vehicles => set({ vehicles }),
  resetVehicles: () => set({ vehicles: [] }),

  reset: () => {
    get().resetVehicles();
    get().resetBrands();
    get().resetModels();
  },
}));
