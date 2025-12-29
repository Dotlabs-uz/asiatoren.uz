import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Media, MediaFormData } from "@/types";

const COLLECTION_NAME = "media";

/**
 * Преобразовать данные из Firestore в Media
 */
const mapDocToMedia = (docId: string, data: any): Media => {
    return {
        id: docId,
        title: data.title || { ru: "", en: "", uz: "" },
        imageUrl: data.imageUrl || "",
        type: data.type || "certificate",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
};

/**
 * Получить все медиа (сертификаты и партнёры)
 */
export const getAllMedia = async (): Promise<Media[]> => {
    try {
        const mediaRef = collection(db, COLLECTION_NAME);
        const q = query(mediaRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => mapDocToMedia(doc.id, doc.data()));
    } catch (error) {
        console.error("Error getting media:", error);
        throw error;
    }
};

/**
 * Получить медиа по типу
 */
export const getMediaByType = async (
    type: "certificate" | "partner"
): Promise<Media[]> => {
    try {
        const mediaRef = collection(db, COLLECTION_NAME);
        const q = query(
            mediaRef,
            where("type", "==", type),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => mapDocToMedia(doc.id, doc.data()));
    } catch (error) {
        console.error("Error getting media by type:", error);
        throw error;
    }
};

/**
 * Получить одно медиа по ID
 */
export const getMedia = async (id: string): Promise<Media | null> => {
    try {
        const mediaRef = doc(db, COLLECTION_NAME, id);
        const snapshot = await getDoc(mediaRef);

        if (!snapshot.exists()) {
            return null;
        }

        return mapDocToMedia(snapshot.id, snapshot.data());
    } catch (error) {
        console.error("Error getting media:", error);
        throw error;
    }
};

/**
 * Создать новое медиа
 */
export const addMedia = async (data: MediaFormData): Promise<string> => {
    try {
        const mediaRef = collection(db, COLLECTION_NAME);

        const mediaData = {
            title: data.title,
            imageUrl: data.imageUrl,
            type: data.type,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(mediaRef, mediaData);
        return docRef.id;
    } catch (error) {
        console.error("Error adding media:", error);
        throw error;
    }
};

/**
 * Обновить медиа
 */
export const updateMedia = async (
    id: string,
    data: Partial<MediaFormData>
): Promise<void> => {
    try {
        const mediaRef = doc(db, COLLECTION_NAME, id);

        const updateData: any = {
            updatedAt: serverTimestamp(),
        };

        if (data.title !== undefined) updateData.title = data.title;
        if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
        if (data.type !== undefined) updateData.type = data.type;

        await updateDoc(mediaRef, updateData);
    } catch (error) {
        console.error("Error updating media:", error);
        throw error;
    }
};

/**
 * Удалить медиа
 */
export const deleteMedia = async (id: string): Promise<void> => {
    try {
        const mediaRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(mediaRef);
    } catch (error) {
        console.error("Error deleting media:", error);
        throw error;
    }
};
