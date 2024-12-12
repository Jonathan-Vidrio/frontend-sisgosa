'use server';

import { ErrorManager, httpRequest } from '@/helpers';
import { cookies } from 'next/headers';
import { createSession, decrypt, deleteSession } from '../../session/session';
import { SignInFormValues } from '@/modules/auth/types/sign-in-form-values';
import { User } from '@/interfaces';
import { SignUpFormValues } from '@/modules/auth/types/sign-up-form-value';
import { VerifyFormValues } from '@/modules/auth/types/verify-form-values';
import { PasswordRecoveryFormValues } from '@/modules/auth/types/password-recovery-form-values';
import { PasswordResetFormValues } from '@/modules/auth/types/password-reset-form-values';

/**
 * @async
 * @function signIn
 * @description Authenticates a user and creates a session
 *
 * @param {SignInFormValues} credentials - User login credentials
 * @returns {Promise<{user: User} | {error: string}>} User data or error message
 */
export async function signIn(credentials: SignInFormValues): Promise<{ user: User } | { error: string }> {
  try {
    const { user, accessToken }: { user: User; accessToken: string } = await httpRequest({
      url: '/auth/sign-in',
      method: 'POST',
      body: { ...credentials },
    });

    const permissions = [];
    if (user.userType?.description?.toUpperCase() === 'SUPERADMIN') permissions.push('superAdmin');
    if (user.userType?.description?.toUpperCase() === 'ADMIN') permissions.push('admin');
    if (user.userType?.description?.toUpperCase() === 'CLIENT') permissions.push('client');
    if (user.userType?.description?.toUpperCase() === 'WORKER') {
      if (user.worker?.workerType?.description?.toUpperCase() === 'RECEPTIONIST') permissions.push('receptionist');
      if (user.worker?.workerType?.description?.toUpperCase() !== 'RECEPTIONIST') permissions.push('worker');
    }

    const { created } = await createSession({ user, permissions, accessToken });
    if (!created) throw ErrorManager.handleError({ error: 'BAD_REQUEST', message: 'Session could not be created.', statusCode: 400 });

    return {
      user: {
        email: user.email,
        firstName: user.firstName,
        firstSurname: user.firstSurname,
        userType: user.userType,
        client: user.client,
        worker: user.worker,
      },
    };
  } catch (error: any) {
    console.error('Error signing in:', error.message);
    return { error: error.message };
  }
}

/**
 * @async
 * @function signUp
 * @description Registers a new user in the system
 *
 * @param {SignUpFormValues} credentials - New user registration data
 * @returns {Promise<{message: string} | {error: string}>} Success message or error
 */
export async function signUp(credentials: SignUpFormValues): Promise<{ message: string } | { error: string }> {
  try {
    const { message } = await httpRequest({
      url: '/auth/sign-up',
      method: 'POST',
      body: { email: credentials.email, password: credentials.password },
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * @async
 * @function verify
 * @description Verifies a user's account and creates their session
 *
 * @param {VerifyFormValues} credentials - Verification credentials including OTP
 * @returns {Promise<{user: User} | {error: string}>} Verified user data or error
 */
export async function verify(credentials: VerifyFormValues): Promise<{ user: User } | { error: string }> {
  try {
    const { user, accessToken }: { user: User; accessToken: string } = await httpRequest({
      url: '/auth/verify-sign-up',
      method: 'POST',
      body: { ...credentials },
    });

    const permissions = [];
    if (user.userType?.description?.toUpperCase() === 'SUPERADMIN') permissions.push('superAdmin');
    if (user.userType?.description?.toUpperCase() === 'ADMIN') permissions.push('admin');
    if (user.userType?.description?.toUpperCase() === 'CLIENT') permissions.push('client');
    if (user.userType?.description?.toUpperCase() === 'WORKER') {
      if (user.worker?.workerType?.description?.toUpperCase() === 'RECEPTIONIST') permissions.push('receptionist');
      if (user.worker?.workerType?.description?.toUpperCase() !== 'RECEPTIONIST') permissions.push('worker');
    }

    const { created } = await createSession({ user, permissions, accessToken });
    if (!created) throw ErrorManager.handleError({ error: 'BAD_REQUEST', message: 'Session could not be created.', statusCode: 400 });

    return {
      user: {
        email: user.email,
        firstName: user.firstName,
        firstSurname: user.firstSurname,
        userType: user.userType,
        client: user.client,
        worker: user.worker,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * @async
 * @function signOut
 * @description Ends user session and logs them out
 *
 * @returns {Promise<any | {error: string}>} Success or error response
 */
export async function signOut(): Promise<any | { error: string }> {
  try {
    const { user, accessToken } = await getAccessSession();

    await deleteSession();

    await httpRequest({
      url: '/auth/sign-out',
      headers: { Authorization: `Bearer ${accessToken}` },
      method: 'POST',
      body: { email: user.email },
    });
  } catch (error: any) {
    // return { error: error.message };
  }
}

/**
 * @async
 * @function getAccessSession
 * @description Retrieves and validates the current user session
 *
 * @returns {Promise<{user: User, accessToken: string, permissions?: string[]}>} Session data
 * @throws {Error} When session is invalid or not found
 */
export const getAccessSession = async (): Promise<{ user: User; accessToken: string; permissions?: string[] }> => {
  try {
    const session = (await cookies()).get('session')?.value;
    if (!session) throw ErrorManager.handleError({ error: 'UNAUTHORIZED', message: 'No session found.', statusCode: 401 });

    // Get the accessToken from the session cookie
    const payload = await decrypt(session);
    if (!payload || !payload.accessToken) throw ErrorManager.handleError({ error: 'UNAUTHORIZED', message: 'Invalid session.', statusCode: 401 });

    return { user: payload.user as User, accessToken: payload.accessToken.toString(), permissions: payload.permissions as string[] };
  } catch (error) {
    return Promise.reject(error);
  }
};

/**
 * @async
 * @function passwordRecovery
 * @description Initiates the password recovery process
 *
 * @param {PasswordRecoveryFormValues} data - Email for recovery
 * @returns {Promise<{message: string} | {error: string}>} Success message or error
 */
export async function passwordRecovery(data: PasswordRecoveryFormValues): Promise<{ message: string } | { error: string }> {
  try {
    const { message } = await httpRequest({
      url: '/auth/password-recovery',
      method: 'POST',
      body: { ...data },
    });

    return { message };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * @async
 * @function passwordReset
 * @description Resets user password and creates new session
 *
 * @param {PasswordResetFormValues} data - New password and verification data
 * @returns {Promise<{user: User} | {error: string}>} Updated user data or error
 */
export async function passwordReset(data: PasswordResetFormValues): Promise<{ user: User } | { error: string }> {
  try {
    const { user, accessToken } = await httpRequest({
      url: '/auth/password-reset',
      method: 'POST',
      body: { email: data.email, password: data.password, otp: data.otp },
    });

    const permissions = [];
    if (user.userType?.description?.toUpperCase() === 'SUPERADMIN') permissions.push('superAdmin');
    if (user.userType?.description?.toUpperCase() === 'ADMIN') permissions.push('admin');
    if (user.userType?.description?.toUpperCase() === 'CLIENT') permissions.push('client');
    if (user.userType?.description?.toUpperCase() === 'WORKER') {
      if (user.worker?.workerType?.description?.toUpperCase() === 'RECEPTIONIST') permissions.push('receptionist');
      if (user.worker?.workerType?.description?.toUpperCase() !== 'RECEPTIONIST') permissions.push('worker');
    }

    const { created } = await createSession({ user, permissions, accessToken });
    if (!created) throw ErrorManager.handleError({ error: 'BAD_REQUEST', message: 'Session could not be created.', statusCode: 400 });

    return {
      user: {
        email: user.email,
        firstName: user.firstName,
        firstSurname: user.firstSurname,
        userType: user.userType,
        client: user.client,
        worker: user.worker,
      },
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
