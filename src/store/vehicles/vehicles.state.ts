import { Vehicle, VehicleBrand, VehicleModel } from '@/interfaces';

/**
 * @interface VehiclesState
 * @description Defines the structure and actions for vehicles state management
 *
 * @property {Vehicle[]} [vehicles] - Array of vehicle objects
 * @property {VehicleBrand[]} [brands] - Array of vehicle brand objects
 * @property {VehicleModel[]} [models] - Array of vehicle model objects
 */
export interface VehiclesState {
  /**
   * @property {Vehicle[]} [vehicles]
   * @description Optional array containing all vehicles
   * @default undefined
   */
  vehicles?: Vehicle[];

  /**
   * @property {VehicleBrand[]} [brands]
   * @description Optional array containing all vehicle brands
   * @default undefined
   */
  brands?: VehicleBrand[];

  /**
   * @property {VehicleModel[]} [models]
   * @description Optional array containing all vehicle models
   * @default undefined
   */
  models?: VehicleModel[];

  /**
   * @method setVehicles
   * @description Updates the vehicles array in the state
   * @param {Vehicle[]} vehicles - Array of vehicles to set
   * @returns {void}
   */
  setVehicles: (vehicles: Vehicle[]) => void;

  /**
   * @method resetVehicles
   * @description Resets vehicles array to an empty array
   * @returns {void}
   */
  resetVehicles: () => void;

  /**
   * @method setBrands
   * @description Updates the vehicle brands array in the state
   * @param {VehicleBrand[]} brands - Array of vehicle brands to set
   * @returns {void}
   */
  setBrands: (brands: VehicleBrand[]) => void;

  /**
   * @method resetBrands
   * @description Resets brands array to an empty array
   * @returns {void}
   */
  resetBrands: () => void;

  /**
   * @method setModels
   * @description Updates the vehicle models array in the state
   * @param {VehicleModel[]} models - Array of vehicle models to set
   * @returns {void}
   */
  setModels: (models: VehicleModel[]) => void;

  /**
   * @method resetModels
   * @description Resets models array to an empty array
   * @returns {void}
   */
  resetModels: () => void;

  /**
   * @method reset
   * @description Resets entire vehicles state to initial values
   * @returns {void}
   */
  reset: () => void;
}
