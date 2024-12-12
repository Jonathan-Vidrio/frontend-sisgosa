import { Status } from '@/interfaces';

/**
 * @interface StatusesState
 * @description Defines the structure and actions for statuses state management
 *
 * @property {Status[]} [statuses] - Array of status objects
 */
export interface StatusesState {
  /**
   * @property {Status[]} [statuses]
   * @description Optional array containing all available statuses
   * @default undefined
   */
  statuses?: Status[];

  /**
   * @method setStatuses
   * @description Updates the statuses array in the state
   * @param {Status[]} statuses - Array of statuses to set
   * @returns {void}
   */
  setStatuses(statuses: Status[]): void;

  /**
   * @method resetStatuses
   * @description Resets statuses array to undefined
   * @returns {void}
   */
  resetStatuses(): void;

  /**
   * @method reset
   * @description Resets entire statuses state to initial values
   * @returns {void}
   */
  reset(): void;
}
