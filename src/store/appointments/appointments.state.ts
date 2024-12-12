import { Appointment } from '@/interfaces';

/**
 * @interface AppointmentsState
 * @description Interface defining the appointments state and its actions
 */
export interface AppointmentsState {
  /** Current appointments list */
  appointments?: Appointment[];
  /** Historical appointments list */
  history?: Appointment[];

  /**
   * @function setAppointments
   * @description Sets the current appointments list
   * @param {Appointment[]} appointments - Array of appointments to set
   */
  setAppointments: (appointments: Appointment[]) => void;

  /**
   * @function resetAppointments
   * @description Resets current appointments to undefined
   */
  resetAppointments: () => void;

  /**
   * @function setHistory
   * @description Sets the appointments history list
   * @param {Appointment[]} appointments - Array of historical appointments
   */
  setHistory: (appointments: Appointment[]) => void;

  /**
   * @function resetHistory
   * @description Resets appointments history to undefined
   */
  resetHistory: () => void;

  /**
   * @function reset
   * @description Resets entire appointments state
   */
  reset: () => void;
}
