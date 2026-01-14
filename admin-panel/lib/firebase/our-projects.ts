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
import { db } from "./config"; // Твой конфиг firebase
import { OurProjects, OurProjectsFormData } from "@/types/index";

const COLLECTION_NAME = "our-projects";

const mapDocToProject = (doc: any): OurProjects => {
    const data = doc.data();

    return {
        id: doc.id,
        title: data.title,
        previewImageUrl: data.previewImageUrl || "",
        content: data.content || "",
        images: data.images || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
    };
};

/**
 * Получить все проекты
 */
export const getAllProjects = async (): Promise<OurProjects[]> => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(mapDocToProject);
    } catch (error) {
        console.error("Error getting projects:", error);
        throw error;
    }
};

/**
 * Получить проект по ID
 */
export const getProject = async (id: string): Promise<OurProjects | null> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return null;
        }

        return mapDocToProject(docSnap);
    } catch (error) {
        console.error("Error getting project:", error);
        throw error;
    }
};

/**
 * Создать новый проект
 */
export const addProject = async (
    data: OurProjectsFormData
): Promise<string> => {
    try {
        const projectData = {
            title: data.title,
            previewImageUrl: data.previewImageUrl || "",
            content: data.content,
            images: data.images || [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(
            collection(db, COLLECTION_NAME),
            projectData
        );
        return docRef.id;
    } catch (error) {
        console.error("Error adding project:", error);
        throw error;
    }
};

/**
 * Обновить проект
 */
export const updateProject = async (
    id: string,
    data: Partial<OurProjectsFormData>
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
        console.error("Error updating project:", error);
        throw error;
    }
};

/**
 * Удалить проект
 */
export const deleteProject = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
    } catch (error) {
        console.error("Error deleting project:", error);
        throw error;
    }
};
