import { useModalStore } from '@/store';
import { ErrorManager } from './error-manager.helper';
import { fetchSignOut } from '@/modules/auth/fetching/auth';

/**
 * @module createError
 * @description Handles error creation and displays it in a modal
 *
 * @param {string} error - Error message
 * @returns {Promise<void>}
 *
 * @example
 * await createError('Some error message');
 */
export async function createError(error: string): Promise<void> {
  const { openModal, setIsErrored, setChildren } = useModalStore.getState();

  const { statusCode, message } = ErrorManager.createSignature(error);

  if ([401, 403].includes(statusCode)) await fetchSignOut();

  openModal();
  setIsErrored();
  setChildren(message);
}
