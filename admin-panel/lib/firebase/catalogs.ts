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
import { Catalog, CatalogFormData } from "@/types/index";

const COLLECTION_NAME = "catalogs";

const mapDocToCatalog = (doc: any): Catalog => {
    const data = doc.data();

    return {
        id: doc.id,
        name: data.name,
        imageUrl: data.imageUrl || "",
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileType: data.fileType,
        fileSize: data.fileSize,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
};

/**
 * Получить все каталоги
 */
export const getAllCatalogs = async (): Promise<Catalog[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(mapDocToCatalog);
    } catch (error) {
        console.error("Error getting catalogs:", error);
        throw error;
    }
};

/**
 * Получить каталог по ID
 */
export const getCatalog = async (id: string): Promise<Catalog | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return mapDocToCatalog(docSnap);
    } catch (error) {
        console.error("Error getting catalog:", error);
        throw error;
    }
};

/**
 * Создать новый каталог
 */
export const addCatalog = async (data: CatalogFormData): Promise<string> => {
    try {
        const catalogData = {
            name: data.name,
            imageUrl: data.imageUrl || "",
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileType: data.fileType,
            fileSize: data.fileSize,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(
            collection(db, COLLECTION_NAME),
            catalogData
        );
        return docRef.id;
    } catch (error) {
        console.error("Error adding catalog:", error);
        throw error;
    }
};

/**
 * Обновить каталог
 */
export const updateCatalog = async (
    id: string,
    data: Partial<CatalogFormData>
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
        console.error("Error updating catalog:", error);
        throw error;
    }
};

/**
 * Удалить каталог
 */
export const deleteCatalog = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting catalog:", error);
        throw error;
    }
};
