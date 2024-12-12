import {
  useAppointmentsStore,
  useAuthStore,
  useModalStore,
  useProductsStore,
  useServicesStore,
  useStatusesStore,
  useUiStore,
  useUsersStore,
  useVehiclesStore,
} from '@/store';
import { createError } from '@/helpers';
import { SignInFormValues } from '../types/sign-in-form-values';
import { SignUpFormValues } from '../types/sign-up-form-value';
import { VerifyFormValues } from '../types/verify-form-values';
import { passwordRecovery, passwordReset, signIn, signOut, signUp, verify } from '@/app/lib/actions/auth/auth';
import { PasswordRecoveryFormValues } from '../types/password-recovery-form-values';
import { PasswordResetFormValues } from '../types/password-reset-form-values';

/**
 * @async
 * @function fetchSignIn
 * @description Handles user sign-in process and updates relevant stores
 *
 * @param {SignInFormValues} data - User credentials
 * @returns {Promise<void>}
 * @throws {Error} When sign-in fails
 */
export async function fetchSignIn(data: SignInFormValues): Promise<void> {
  const { showLoading } = useUiStore.getState();
  const { openModal, setIsSuccess: setIsSucces, setChildren } = useModalStore.getState();
  const { setUser } = useAuthStore.getState();

  try {
    const response = await signIn({ ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { user } = response;

    openModal();
    setIsSucces();
    setChildren('Signed in successfully.');

    setUser(user);
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    showLoading();
  }
}

/**
 * @async
 * @function fetchSignUp
 * @description Handles new user registration
 *
 * @param {SignUpFormValues} data - New user registration data
 * @returns {Promise<void>}
 * @throws {Error} When registration fails
 */
export async function fetchSignUp(data: SignUpFormValues): Promise<void> {
  const { openModal, setIsSuccess: setIsSucces, setChildren } = useModalStore.getState();

  try {
    const response = await signUp({ ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    openModal();
    setIsSucces();
    setChildren(message);
  } catch (error: any) {
    throw createError(error.message);
  }
}

/**
 * @async
 * @function fetchVerify
 * @description Handles user account verification process
 *
 * @param {VerifyFormValues} data - Verification data including OTP
 * @returns {Promise<boolean>} Returns true if verification is successful
 * @throws {Error} When verification fails
 */
export async function fetchVerify(data: VerifyFormValues): Promise<boolean> {
  const { openModal, setIsSuccess: setIsSucces, setChildren } = useModalStore.getState();
  const { showLoading, hideLoading } = useUiStore.getState();
  const { setUser } = useAuthStore.getState();

  try {
    showLoading();

    const response = await verify({ ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { user } = response;

    openModal();
    setIsSucces();
    setChildren('Account verified successfully.');

    setUser(user);

    return !!user;
  } catch (error: any) {
    throw createError(error.message);
  } finally {
    hideLoading();
  }
}

/**
 * @async
 * @function fetchSignOut
 * @description Handles user sign-out and resets all application stores
 *
 * @returns {Promise<void>}
 */
export async function fetchSignOut(): Promise<void> {
  const { showLoading, hideLoading } = useUiStore.getState();

  const { reset: resetAppointments } = useAppointmentsStore.getState();
  const { reset: resetAuth } = useAuthStore.getState();
  const { reset: resetModal } = useModalStore.getState();
  const { reset: resetProducts } = useProductsStore.getState();
  const { reset: resetServices } = useServicesStore.getState();
  const { reset: resetStatuses } = useStatusesStore.getState();
  const { reset: resetUi } = useUiStore.getState();
  const { reset: resetUsers } = useUsersStore.getState();
  const { reset: resetVehicles } = useVehiclesStore.getState();

  try {
    showLoading();

    await signOut();
  } catch {
    // Ignore
  } finally {
    resetAppointments();
    resetAuth();
    resetModal();
    resetServices();
    resetStatuses();
    resetUi();
    resetUsers();
    resetVehicles();

    hideLoading();
  }
}

/**
 * @async
 * @function fetchPasswordRecovery
 * @description Initiates password recovery process
 *
 * @param {PasswordRecoveryFormValues} data - Email for password recovery
 * @returns {Promise<void>}
 * @throws {Error} When recovery process fails
 */
export async function fetchPasswordRecovery(data: PasswordRecoveryFormValues): Promise<void> {
  const { openModal, setIsSuccess: setIsSucces, setChildren } = useModalStore.getState();

  try {
    const response = await passwordRecovery({ ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { message } = response;

    openModal();
    setIsSucces();
    setChildren(message);
  } catch (error: any) {
    throw createError(error.message);
  }
}

/**
 * @async
 * @function fetchPasswordReset
 * @description Handles password reset process
 *
 * @param {PasswordResetFormValues} data - New password and reset token
 * @returns {Promise<void>}
 * @throws {Error} When password reset fails
 */
export async function fetchPasswordReset(data: PasswordResetFormValues): Promise<void> {
  const { openModal, setIsSuccess: setIsSucces, setChildren } = useModalStore.getState();
  const { setUser } = useAuthStore.getState();

  try {
    const response = await passwordReset({ ...data });
    if (response && 'error' in response) throw new Error(response.error);

    const { user } = response;

    openModal();
    setIsSucces();
    setChildren('Password reset successfully.');

    setUser(user);
  } catch (error: any) {
    throw createError(error.message);
  }
}
