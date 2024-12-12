import { Client, User, UserType, Worker, WorkerType } from '@/interfaces';

/**
 * @interface UsersState
 * @description Defines the structure and actions for users state management
 *
 * @property {User[]} [users] - Array of user objects
 * @property {UserType[]} [userTypes] - Array of user type objects
 * @property {Worker[]} [workers] - Array of worker objects
 * @property {WorkerType[]} [workerTypes] - Array of worker type objects
 * @property {Client[]} [clients] - Array of client objects
 */
export interface UsersState {
  /**
   * @property {User[]} [users]
   * @description Optional array containing all users
   * @default undefined
   */
  users?: User[];

  /**
   * @property {UserType[]} [userTypes]
   * @description Optional array containing all user types
   * @default undefined
   */
  userTypes?: UserType[];

  /**
   * @property {Worker[]} [workers]
   * @description Optional array containing all workers
   * @default undefined
   */
  workers?: Worker[];

  /**
   * @property {WorkerType[]} [workerTypes]
   * @description Optional array containing all worker types
   * @default undefined
   */
  workerTypes?: WorkerType[];

  /**
   * @property {Client[]} [clients]
   * @description Optional array containing all clients
   * @default undefined
   */
  clients?: Client[];

  /**
   * @method setUsers
   * @description Updates the users array in the state
   * @param {User[]} users - Array of users to set
   * @returns {void}
   */
  setUsers: (users: User[]) => void;

  /**
   * @method resetUsers
   * @description Resets users array to undefined
   * @returns {void}
   */
  resetUsers: () => void;

  /**
   * @method setUserTypes
   * @description Updates the user types array in the state
   * @param {UserType[]} userTypes - Array of user types to set
   * @returns {void}
   */
  setUserTypes: (userTypes: UserType[]) => void;

  /**
   * @method resetUserTypes
   * @description Resets user types array to undefined
   * @returns {void}
   */
  resetUserTypes: () => void;

  /**
   * @method setWorkers
   * @description Updates the workers array in the state
   * @param {Worker[]} workers - Array of workers to set
   * @returns {void}
   */
  setWorkers: (workers: Worker[]) => void;

  /**
   * @method resetWorkers
   * @description Resets workers array to undefined
   * @returns {void}
   */
  resetWorkers: () => void;

  /**
   * @method setWorkerTypes
   * @description Updates the worker types array in the state
   * @param {WorkerType[]} workerTypes - Array of worker types to set
   * @returns {void}
   */
  setWorkerTypes: (workerTypes: WorkerType[]) => void;

  /**
   * @method resetWorkerTypes
   * @description Resets worker types array to undefined
   * @returns {void}
   */
  resetWorkerTypes: () => void;

  /**
   * @method setClients
   * @description Updates the clients array in the state
   * @param {Client[]} clients - Array of clients to set
   * @returns {void}
   */
  setClients: (clients: Client[]) => void;

  /**
   * @method resetClients
   * @description Resets clients array to undefined
   * @returns {void}
   */
  resetClients: () => void;

  /**
   * @method reset
   * @description Resets entire users state to initial values
   * @returns {void}
   */
  reset: () => void;
}
