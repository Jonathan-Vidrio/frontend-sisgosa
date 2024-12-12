import 'server-only';
import { cookies } from 'next/headers';
import { decrypt } from '../session/session';
import { User } from '@/interfaces';

/**
 * @function verify
 * @description Cached function to verify and retrieve user session data
 *
 * @returns {Promise<{user: User, accessToken: string}>} User and token from session
 * @throws {Error} When session is invalid or missing
 *
 * @cached
 */
export const verify = async (): Promise<{ user: User; accessToken: string }> => {
  const session = (await cookies()).get('session')?.value as string;
  const data = await decrypt(session);
  const { user, accessToken } = data as { user: User; accessToken: string };
  return { user, accessToken };
};
