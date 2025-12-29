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
 * Upload a file to Firebase Storage and return its download URL
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
    try {
        const storageRef: StorageReference = ref(storage, path);
        await uploadBytes(storageRef, file);
        // Получаем URL файла после загрузки
        const url = await getDownloadURL(storageRef);
        return url;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

/**
 * Upload a file and return both result and URL
 * (если нужен результат загрузки)
 */
export const uploadFileWithResult = async (
    file: File,
    path: string
): Promise<{ result: UploadResult; url: string }> => {
    try {
        const storageRef: StorageReference = ref(storage, path);
        const result = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        return { result, url };
    } catch (error) {
        console.error("Error uploading file:", error);
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
        console.error("Error deleting file:", error);
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
        console.error("Error getting file URL:", error);
        throw error;
    }
};
