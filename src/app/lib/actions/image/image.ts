'use server';

import { storage } from '@/app/lib/config/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';

/**
 * @async
 * @function uploadImage
 * @description Uploads an image file to Firebase Storage
 *
 * @param {File} file - The image file to upload
 * @param {string} path - The storage path where the image will be saved
 *
 * @returns {Promise<string | undefined>} The download URL of the uploaded image or undefined if no file
 * @throws {Error} When upload fails
 *
 * @example
 * const imageUrl = await uploadImage(file, 'users/avatars');
 *
 * @remarks
 * - Generates a unique filename using UUID
 * - Maintains original file extension
 * - Monitors upload state changes
 * - Returns a promise that resolves with the download URL
 */
export async function uploadImage(file: File, path: string): Promise<string | undefined> {
  if (!file) return undefined;

  const ext = file.name.split('.').pop();
  const storageRef = ref(storage, `images/${path}/${v4()}.${ext}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      snapshot => {
        // You can access the snapshot here
        // console.log('Upload progress:', snapshot);
      },
      error => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
      }
    );
  });
}
