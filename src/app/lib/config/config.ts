'use server';

export const getDevelopment = async () => process.env.DEVELOPMENT === 'true';

/**
 * @async
 * @function getHostUrl
 * @description Retrieves the host URL from environment variables
 * @returns {Promise<string>} Host URL or default value
 */
export const getHostUrl = async (): Promise<string> => process.env.HOST_URL || 'localhost';

/**
 * @async
 * @function getSecretKey
 * @description Retrieves the secret key for authentication
 * @returns {Promise<string>} Secret key or default value
 */
export const getSecretKey = async (): Promise<string> => process.env.SECRET_KEY || 'secret';

// Firebase Configuration
/**
 * @async
 * @function getApiKey
 * @description Retrieves Firebase API key
 * @returns {Promise<string>} Firebase API key or default value
 */
export const getApiKey = async (): Promise<string> => process.env.API_KEY || 'api_key';

/**
 * @async
 * @function getAuthDomain
 * @description Retrieves Firebase authentication domain
 * @returns {Promise<string>} Firebase auth domain or default value
 */
export const getAuthDomain = async (): Promise<string> => process.env.AUTH_DOMAIN || 'auth_domain';

/**
 * @async
 * @function getProjectId
 * @description Retrieves Firebase project ID
 * @returns {Promise<string>} Firebase project ID or default value
 */
export const getProjectId = async (): Promise<string> => process.env.PROJECT_ID || 'project_id';

/**
 * @async
 * @function getStorageBucket
 * @description Retrieves Firebase storage bucket URL
 * @returns {Promise<string>} Firebase storage bucket or default value
 */
export const getStorageBucket = async (): Promise<string> => process.env.STORAGE_BUCKET || 'storage_bucket';

/**
 * @async
 * @function getMessagingSenderId
 * @description Retrieves Firebase messaging sender ID
 * @returns {Promise<string>} Firebase messaging sender ID or default value
 */
export const getMessagingSenderId = async (): Promise<string> => process.env.MESSAGING_SENDER_ID || 'messaging_sender_id';

/**
 * @async
 * @function getAppId
 * @description Retrieves Firebase application ID
 * @returns {Promise<string>} Firebase app ID or default value
 */
export const getAppId = async (): Promise<string> => process.env.APP_ID || 'app_id';
