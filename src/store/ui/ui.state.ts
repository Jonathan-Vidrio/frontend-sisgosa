/**
 * @interface UIState
 * @description Defines the structure and actions for UI state management
 *
 * @property {number} loadingCount - Counter for active loading processes
 * @property {boolean} isLoading - Flag indicating if the application is currently loading
 * @property {boolean} isVerticalNavarOpen - Flag indicating if the vertical navbar is open
 */
export interface UIState {
  /**
   * @property {number} loadingCount
   * @description Counter for active loading processes
   * @default 0
   */
  loadingCount: number;

  /**
   * @property {boolean} isLoading
   * @description Flag indicating if the application is currently loading
   * @default false
   */
  isLoading: boolean;

  /**
   * @property {boolean} isVerticalNavarOpen
   * @description Flag indicating if the vertical navbar is open
   * @default false
   */
  isVerticalNavarOpen: boolean;

  /**
   * @method showLoading
   * @description Increments the loading counter and sets isLoading to true
   * @returns {void}
   */
  showLoading: () => void;

  /**
   * @method hideLoading
   * @description Decrements the loading counter and updates isLoading accordingly
   * @returns {void}
   */
  hideLoading: () => void;

  /**
   * @method showVerticalNavbar
   * @description Sets isVerticalNavarOpen to true
   * @returns {void}
   */
  showVerticalNavbar: () => void;

  /**
   * @method hideVerticalNavbar
   * @description Sets isVerticalNavarOpen to false
   * @returns {void}
   */
  hideVerticalNavbar: () => void;

  /**
   * @method reset
   * @description Resets the entire UI state to initial values
   * @returns {void}
   */
  reset: () => void;
}
