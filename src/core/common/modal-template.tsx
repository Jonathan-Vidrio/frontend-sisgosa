'use client';

import { useModalStore } from '@/store';
import { useEffect, useRef } from 'react';

/**
 * @function ModalTemplate
 * @description Component that renders a modal dialog with customizable content and actions
 *
 * @returns {JSX.Element} Rendered modal dialog
 */
export const ModalTemplate = (): JSX.Element => {
  const { isOpen, isErrored, isSucces, isConfirm, title, children, functions, closeModal } = useModalStore(state => state);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCancel = () => {
    closeModal();
  };

  const handleOk = () => {
    if (isErrored || isSucces) closeModal();
    if ((isConfirm || isSucces) && functions.handleSubmit) {
      functions.handleSubmit();
      closeModal();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && isOpen) {
        handleOk();
      } else if (event.key === 'Escape' && isOpen) {
        handleCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isErrored, isSucces, isConfirm, functions]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          ref={modalRef}
          tabIndex={-1}
          className={`fixed inset-0 z-40 bg-black/25 transition-opacity duration-500 flex justify-center items-center opacity-100`}
        >
          <dialog
            open
            className={`w-[90%] sm:w-[530px] h-[330px] p-[50px] bg-gray-50 flex justify-between flex-col rounded-xl transition-transform duration-500 transform scale-100 z-50`}
          >
            {/* Title */}
            <div className='min-h-[30px] max-h-[30px]'>
              <h1 className='text-2xl font-semibold text-center'>
                {isConfirm ? 'Are you sure?' : isErrored ? 'Error' : isSucces ? 'Success' : title || 'Loading...'}
              </h1>
            </div>

            {/* separator */}
            <div className={`border-b-4 ${isErrored ? 'border-red-500' : 'border-blue-500'}  w-32 self-center`} />

            {/* Content */}
            <div className='min-h-[80px] max-h-[80px] flex items-center justify-center'>
              <p className='text-center'>{children || 'Uknown'} </p>
            </div>

            {/* Actions */}
            <div className='flex flex-row justify-center min-h-[50px] max-h-[30px] gap-5 font-semibold'>
              {isConfirm && (
                <button className='w-[205px] h-full rounded-md border border-gray-200 hover:bg-gray-400' onClick={handleCancel}>
                  Cancel
                </button>
              )}

              <button
                className={`w-[205px] h-full rounded-md ${isErrored ? 'bg-red-500' : 'bg-blue-500'} hover:bg-gray-400 text-white`}
                onClick={handleOk}
              >
                Ok
              </button>
            </div>
          </dialog>
        </div>
      )}
    </>
  );
};
