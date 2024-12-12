import { create } from 'zustand';
import { ModalState } from './modal.state';

/**
 * @constant
 * @description Zustand store hook for modal state management
 *
 * @example
 * // Basic usage
 * const { openModal, setChildren } = useModalStore();
 * openModal();
 * setChildren('Modal content');
 *
 * // Confirmation dialog
 * const { setIsConfirm, setHandleSubmit } = useModalStore();
 * setIsConfirm();
 * setHandleSubmit(() => handleConfirmAction());
 *
 * @returns {ModalState} Modal state and actions
 */
export const useModalStore = create<ModalState>()((set, get) => ({
  // Initial state
  isOpen: false,
  isSucces: false,
  isConfirm: false,
  isErrored: false,
  title: '',
  children: '',
  functions: {
    handleCancel: () => {},
    handleSubmit: () => {},
  },

  openModal: () => set({ isOpen: true }),
  closeModal: () => {
    set({ isOpen: false });
    get().reset();
  },

  setIsSuccess: () => set({ isSucces: true }),
  resetIsSucces: () => set({ isSucces: false }),

  setIsConfirm: () => set({ isConfirm: true }),
  resetIsConfirm: () => set({ isConfirm: false }),

  setIsErrored: () => set({ isErrored: true }),
  resetIsErrored: () => set({ isErrored: false }),

  setTitle: title => set({ title }),
  resetTitle: () => set({ title: '' }),

  setChildren: children => set({ children }),
  resetChildren: () => set({ children: '' }),

  setHandleSubmit: action => set({ functions: { handleSubmit: action, handleCancel: () => get().closeModal() } }),
  resetHandleSubmit: () => set({ functions: { handleSubmit: () => {}, handleCancel: () => get().closeModal() } }),

  reset: () => {
    get().resetIsSucces();
    get().resetIsConfirm();
    get().resetIsErrored();
    get().resetTitle();
    get().resetChildren();
    get().resetHandleSubmit();
  },
}));
