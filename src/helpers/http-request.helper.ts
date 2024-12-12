'use server';

import { HttpRequest } from '@/interfaces';
import { ErrorManager } from './error-manager.helper';
import { getHostUrl } from '@/app/lib/config/config';

/**
 * @function fetchWithTimeout
 * @description Fetches a URL with a timeout
 *
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} Fetch response
 *
 * @throws {ErrorManager} When the request times out
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(ErrorManager.handleError({ error: 'REQUEST_TIMEOUT', message: 'Request timeout', statusCode: 408 }));
    }, timeout);
  });

  console.log('\n\n---------- Start Fetching ----------');
  console.log('fetching:', url);
  console.log('options:', options);

  const fetchPromise = fetch(url, options).then(response => {
    clearTimeout(timeoutId);
    return response;
  });

  return Promise.race([fetchPromise, timeoutPromise]);
}

/**
 * @function httpRequest
 * @description Makes an HTTP request with error handling and timeout
 *
 * @param {HttpRequest} parameters - HTTP request parameters
 * @param {number} [timeout=20000] - Timeout in milliseconds
 * @returns {Promise<any>} Response data
 *
 * @throws {ErrorManager} When the request fails
 *
 * @example
 * const data = await httpRequest({ url: '/api/data', method: 'GET' });
 */
export async function httpRequest<T>(parameters: HttpRequest, timeout: number = 20000): Promise<any> {
  const hostUrl = await getHostUrl();

  const { url, method, headers, body } = parameters;

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetchWithTimeout(hostUrl + url, options, timeout);

    if (!response.ok) {
      throw ErrorManager.handleError(await response.json());
    }

    // print the response body
    const responseBody = await response.clone().text();
    console.log('response:', responseBody);

    return response.json();
  } catch (error: any) {
    console.error('Error fetching:', error.message);
    return Promise.reject(error);
  } finally {
    console.log('----------- End Fetching -----------\n\n');
  }
}
