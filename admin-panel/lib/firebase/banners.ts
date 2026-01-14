import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import { Banner, BannerFormData } from "@/types";

const COLLECTION_NAME = "banners";

const mapDocToBanner = (doc: any): Banner => {
    const data = doc.data();

    return {
        id: doc.id,
        imageUrl: data.imageUrl,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
};

/**
 * Получить все баннеры
 */
export const getAllBanners = async (): Promise<Banner[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(mapDocToBanner);
    } catch (error) {
        console.error("Error getting banners:", error);
        throw error;
    }
};

/**
 * Получить баннер по ID
 */
export const getBanner = async (id: string): Promise<Banner | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return mapDocToBanner(docSnap);
    } catch (error) {
        console.error("Error getting banner:", error);
        throw error;
    }
};

/**
 * Создать новый баннер
 */
export const addBanner = async (data: BannerFormData): Promise<string> => {
    try {
        const bannerData = {
            imageUrl: data.imageUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(
            collection(db, COLLECTION_NAME),
            bannerData
        );
        return docRef.id;
    } catch (error) {
        console.error("Error adding banner:", error);
        throw error;
    }
};

/**
 * Обновить баннер
 */
export const updateBanner = async (
    id: string,
    data: Partial<BannerFormData>
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
        console.error("Error updating banner:", error);
        throw error;
    }
};

/**
 * Удалить баннер
 */
export const deleteBanner = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting banner:", error);
        throw error;
    }
};
