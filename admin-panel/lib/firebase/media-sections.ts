import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { MediaSection, MediaSectionFormData } from "@/types/index";

const COLLECTION_NAME = "media-sections";

const mapDocToMediaSection = (doc: any): MediaSection => {
    const data = doc.data();

    return {
        id: doc.id,
        sectionId: data.sectionId,
        pagePath: data.pagePath,
        sectionName: data.sectionName,
        mediaType: data.mediaType,
        mediaUrl: data.mediaUrl,
        thumbnailUrl: data.thumbnailUrl || "",
        description: data.description || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
};

/**
 * Получить все медиа-секции
 */
export const getAllMediaSections = async (): Promise<MediaSection[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy("pagePath", "asc"),
            orderBy("order", "asc"),
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(mapDocToMediaSection);
    } catch (error) {
        console.error("Error getting media sections:", error);
        throw error;
    }
};

/**
 * Получить медиа-секции по пути страницы
 */
export const getMediaSectionsByPage = async (
    pagePath: string,
): Promise<MediaSection[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("pagePath", "==", pagePath),
            orderBy("order", "asc"),
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(mapDocToMediaSection);
    } catch (error) {
        console.error("Error getting media sections by page:", error);
        throw error;
    }
};

/**
 * Получить медиа-секцию по ID секции
 */
export const getMediaSectionBySectionId = async (
    sectionId: string,
): Promise<MediaSection[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("sectionId", "==", sectionId),
            orderBy("order", "asc"),
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(mapDocToMediaSection);
    } catch (error) {
        console.error("Error getting media section by sectionId:", error);
        throw error;
    }
};

/**
 * Получить медиа-секцию по ID
 */
export const getMediaSection = async (
    id: string,
): Promise<MediaSection | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return mapDocToMediaSection(docSnap);
    } catch (error) {
        console.error("Error getting media section:", error);
        throw error;
    }
};

/**
 * Создать новую медиа-секцию
 */
export const addMediaSection = async (
    data: MediaSectionFormData,
): Promise<string> => {
    try {
        const mediaSectionData = {
            sectionId: data.sectionId,
            pagePath: data.pagePath,
            sectionName: data.sectionName,
            mediaType: data.mediaType,
            mediaUrl: data.mediaUrl,
            thumbnailUrl: data.thumbnailUrl || "",
            description: data.description || "",
            order: data.order || 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(
            collection(db, COLLECTION_NAME),
            mediaSectionData,
        );
        return docRef.id;
    } catch (error) {
        console.error("Error adding media section:", error);
        throw error;
    }
};

/**
 * Обновить медиа-секцию
 */
export const updateMediaSection = async (
    id: string,
    data: Partial<MediaSectionFormData>,
): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);

        const updateData: any = {
            ...data,
            updatedAt: serverTimestamp(),
        };

        // Убираем undefined значения
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        await updateDoc(docRef, updateData);
    } catch (error) {
        console.error("Error updating media section:", error);
        throw error;
    }
};

/**
 * Удалить медиа-секцию
 */
export const deleteMediaSection = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting media section:", error);
        throw error;
    }
};
