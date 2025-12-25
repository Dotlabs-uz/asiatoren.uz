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
import { Media } from "@/types";

const COLLECTION_NAME = "media";

/**
 * Получить все медиа (сертификаты и партнёры)
 */
export const getAllMedia = async (): Promise<Media[]> => {
    try {
        const mediaRef = collection(db, COLLECTION_NAME);
        const q = query(mediaRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                imageUrl: data.imageUrl || "",
                type: data.type || "certificate",
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Media;
        });
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

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                imageUrl: data.imageUrl || "",
                type: data.type,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Media;
        });
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

        const data = snapshot.data();
        return {
            id: snapshot.id,
            title: data.title || "",
            imageUrl: data.imageUrl || "",
            type: data.type || "certificate",
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Media;
    } catch (error) {
        console.error("Error getting media:", error);
        throw error;
    }
};

/**
 * Создать новое медиа
 */
export const addMedia = async (data: {
    title: string;
    imageUrl: string;
    type: "certificate" | "partner";
}): Promise<string> => {
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
    data: Partial<{
        title: string;
        imageUrl: string;
        type: "certificate" | "partner";
    }>
): Promise<void> => {
    try {
        const mediaRef = doc(db, COLLECTION_NAME, id);

        const updateData: any = {
            ...data,
            updatedAt: serverTimestamp(),
        };

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
