export interface ModalState {
  /** Modal visibility state */
  isOpen: boolean;
  /** Success state flag */
  isSucces: boolean;
  /** Confirmation dialog state flag */
  isConfirm: boolean;
  /** Error state flag */
  isErrored: boolean;
  /** Modal title */
  title: string;
  /** Modal content */
  children: React.ReactNode | string;
  /** Modal action functions */
  functions: {
    handleSubmit: () => void;
    handleCancel: () => void;
  };

  /** Opens the modal */
  openModal: () => void;
  /** Closes the modal and resets state */
  closeModal: () => void;

  /** Sets success state */
  setIsSuccess: () => void;
  /** Resets success state */
  resetIsSucces: () => void;

  /** Sets confirmation dialog state */
  setIsConfirm: () => void;
  /** Resets confirmation dialog state */
  resetIsConfirm: () => void;

  /** Sets error state */
  setIsErrored: () => void;
  /** Resets error state */
  resetIsErrored: () => void;

  /** Sets modal title */
  setTitle: (title: string) => void;
  /** Resets modal title */
  resetTitle: () => void;

  /** Sets modal content */
  setChildren: (children: React.ReactNode | string) => void;
  /** Resets modal content */
  resetChildren: () => void;

  /** Sets submit handler function */
  setHandleSubmit: (action: () => void) => void;
  /** Resets submit handler */
  resetHandleSubmit: () => void;

  /** Resets entire modal state */
  reset: () => void;
}
