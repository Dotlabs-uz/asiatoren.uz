import {
    ref,
    uploadBytes,
    deleteObject,
    getDownloadURL,
    UploadResult,
    StorageReference,
} from "firebase/storage";
import { storage } from "./config";

/**
 * Upload a file to Firebase Storage
 */
export const uploadFile = async (
    file: File,
    path: string
): Promise<UploadResult> => {
    try {
        const storageRef: StorageReference = ref(storage, path);
        const result = await uploadBytes(storageRef, file);
        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteFile = async (path: string): Promise<void> => {
    try {
        const storageRef: StorageReference = ref(storage, path);
        await deleteObject(storageRef);
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a file from Firebase Storage by URL
 */
export const deleteFileByURL = async (url: string): Promise<void> => {
    try {
        // Извлекаем путь из URL
        // URL формат: https://firebasestorage.googleapis.com/v0/b/PROJECT.appspot.com/o/path%2Fto%2Ffile.jpg?alt=media&token=...
        const decodedUrl = decodeURIComponent(url);

        // Находим часть между /o/ и ?
        const pathMatch = decodedUrl.match(/\/o\/(.+?)\?/);

        if (!pathMatch || !pathMatch[1]) {
            throw new Error("Invalid Storage URL");
        }

        const path = pathMatch[1];
        await deleteFile(path);
    } catch (error) {
        console.error("Error deleting file by URL:", error);
        throw error;
    }
};

/**
 * Get download URL for a file in Firebase Storage
 */
export const getFileURL = async (path: string): Promise<string> => {
    try {
        const storageRef: StorageReference = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        throw error;
    }
};
