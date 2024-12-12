import { Service, ServiceType } from '@/interfaces';

/**
 * @interface ServicesState
 * @description Defines the structure and actions for services state management
 *
 * @property {Service[]} [services] - Array of service objects
 * @property {Service[]} [history] - Array of historical service objects
 * @property {ServiceType[]} [serviceTypes] - Array of service type objects
 */
export interface ServicesState {
  /**
   * @property {Service[]} [services]
   * @description Optional array containing all available services
   * @default undefined
   */
  services?: Service[];

  /**
   * @property {Service[]} [history]
   * @description Optional array containing all historical services
   * @default undefined
   */
  history?: Service[];

  /**
   * @property {ServiceType[]} [serviceTypes]
   * @description Optional array containing all service types
   * @default undefined
   */
  serviceTypes?: ServiceType[];

  /**
   * @method setServices
   * @description Updates the services array in the state
   * @param {Service[]} services - Array of services to set
   * @returns {void}
   */
  setServices(services: Service[]): void;

  /**
   * @method resetServices
   * @description Resets services array to undefined
   * @returns {void}
   */
  resetServices(): void;

  /**
   * @method setHistory
   * @description Updates the history array in the state
   * @param {Service[]} history - Array of historical services to set
   * @returns {void}
   */
  setHistory(history: Service[]): void;

  /**
   * @method resetHistory
   * @description Resets history array to undefined
   * @returns {void}
   */
  resetHistory(): void;

  /**
   * @method setServiceTypes
   * @description Updates the service types array in the state
   * @param {ServiceType[]} serviceTypes - Array of service types to set
   * @returns {void}
   */
  setServiceTypes(serviceTypes: ServiceType[]): void;

  /**
   * @method resetServiceTypes
   * @description Resets service types array to undefined
   * @returns {void}
   */
  resetServiceTypes(): void;

  /**
   * @method reset
   * @description Resets entire services state to initial values
   * @returns {void}
   */
  reset(): void;
}
