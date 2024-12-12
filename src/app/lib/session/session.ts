import 'server-only';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { User } from '@/interfaces';
import { getSecretKey } from '../config/config';

/**
 * @private
 * @async
 * @function getEncodedKey
 * @description Encodes the secret key for JWT operations
 *
 * @returns {Promise<Uint8Array>} Encoded secret key
 */
const getEncodedKey = async (): Promise<Uint8Array> => new TextEncoder().encode(await getSecretKey());

/**
 * @async
 * @function encrypt
 * @description Encrypts session data into a JWT
 *
 * @param {{user: User, accessToken: string}} payload - Data to encrypt
 * @returns {Promise<string>} Encrypted JWT string
 * @throws {Error} When encryption fails
 */
export async function encrypt(payload: { user: User; accessToken: string }): Promise<string> {
  try {
    const encodedKey = await getEncodedKey();
    return new SignJWT({ ...payload }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime('1d').sign(encodedKey);
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * @async
 * @function decrypt
 * @description Decrypts a session JWT
 *
 * @param {string} session - JWT session string
 * @returns {Promise<JWTPayload | void>} Decrypted payload
 * @throws {Error} When decryption fails
 */
export async function decrypt(session: string): Promise<JWTPayload | void> {
  try {
    const encodedKey = await getEncodedKey();
    const { payload } = await jwtVerify(session, encodedKey, { algorithms: ['HS256'] });
    return payload;
  } catch (error) {
    // return Promise.reject(error);
  }
}

/**
 * @async
 * @function createSession
 * @description Creates a new session cookie with encrypted data
 *
 * @param {{user: User, permissions: string[], accessToken: string}} data - Session data
 * @returns {Promise<{created: boolean}>} Session creation status
 * @throws {Error} When session creation fails
 */
export async function createSession(data: { user: User; permissions: string[]; accessToken: string }): Promise<{ created: boolean }> {
  try {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12); // 12 hours
    const session = await encrypt({ ...data });

    (await cookies()).set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'strict',
      path: '/',
    });

    return { created: (await cookies()).has('session') };
  } catch (error) {
    return Promise.reject(error);
  }
}

/**
 * @async
 * @function deleteSession
 * @description Deletes the current session cookie
 *
 * @returns {Promise<{deleted: boolean}>} Session deletion status
 * @throws {Error} When session deletion fails
 */
export async function deleteSession(): Promise<{ deleted: boolean }> {
  try {
    (await cookies()).delete('session');
    return { deleted: !(await cookies()).has('session') };
  } catch (error) {
    return Promise.reject(error);
  }
}
