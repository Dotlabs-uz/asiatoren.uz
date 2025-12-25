import {
    collection,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
} from "firebase/firestore";
import { db } from "./config";
import { Application } from "@/types";

const COLLECTION_NAME = "applications";

/**
 * Получить все заявки
 */
export const getApplications = async (): Promise<Application[]> => {
    try {
        const applicationsRef = collection(db, COLLECTION_NAME);
        const q = query(applicationsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name || "",
                surname: data.surname || "",
                phoneNumber: data.phoneNumber || "",
                email: data.email || "",
                text: data.text || "",
                status: data.status || "new",
                createdAt: data.createdAt?.toDate() || new Date(),
            } as Application;
        });
    } catch (error) {
        console.error("Error getting applications:", error);
        throw error;
    }
};

/**
 * Получить заявку по ID
 */
export const getApplication = async (
    id: string
): Promise<Application | null> => {
    try {
        const applicationRef = doc(db, COLLECTION_NAME, id);
        const snapshot = await getDoc(applicationRef);

        if (!snapshot.exists()) {
            return null;
        }

        const data = snapshot.data();
        return {
            id: snapshot.id,
            name: data.name || "",
            surname: data.surname || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            text: data.text || "",
            status: data.status || "new",
            createdAt: data.createdAt?.toDate() || new Date(),
        } as Application;
    } catch (error) {
        console.error("Error getting application:", error);
        throw error;
    }
};

/**
 * Обновить статус заявки
 */
export const updateApplicationStatus = async (
    id: string,
    status: "new" | "processing" | "completed"
): Promise<void> => {
    try {
        const applicationRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(applicationRef, { status });
    } catch (error) {
        console.error("Error updating application status:", error);
        throw error;
    }
};

/**
 * Удалить заявку
 */
export const deleteApplication = async (id: string): Promise<void> => {
    try {
        const applicationRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(applicationRef);
    } catch (error) {
        console.error("Error deleting application:", error);
        throw error;
    }
};
