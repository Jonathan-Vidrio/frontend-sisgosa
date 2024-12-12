import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getApiKey, getAppId, getAuthDomain, getMessagingSenderId, getProjectId, getStorageBucket } from './config';

/**
 * @constant
 * @type {Object}
 * @description Firebase configuration object with all required parameters
 */
export const firebaseConfig: object = {
  apiKey: await getApiKey(),
  authDomain: await getAuthDomain(),
  projectId: await getProjectId(),
  storageBucket: await getStorageBucket(),
  messagingSenderId: await getMessagingSenderId(),
  appId: await getAppId(),
};

// Initialize Firebase
/**
 * @constant
 * @type {FirebaseApp}
 * @description Initialized Firebase application instance
 */
const app = initializeApp(firebaseConfig);

/**
 * @constant
 * @type {FirebaseStorage}
 * @description Firebase storage instance for file operations
 */
export const storage = getStorage(app);
