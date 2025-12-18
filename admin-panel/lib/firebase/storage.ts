import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
  UploadResult,
  StorageReference,
} from "firebase/storage"
import { storage } from "./config"

/**
 * Upload a file to Firebase Storage
 */
export const uploadFile = async (
  file: File,
  path: string
): Promise<UploadResult> => {
  try {
    const storageRef: StorageReference = ref(storage, path)
    const result = await uploadBytes(storageRef, file)
    return result
  } catch (error) {
    throw error
  }
}

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef: StorageReference = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error) {
    throw error
  }
}

/**
 * Get download URL for a file in Firebase Storage
 */
export const getFileURL = async (path: string): Promise<string> => {
  try {
    const storageRef: StorageReference = ref(storage, path)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (error) {
    throw error
  }
}

