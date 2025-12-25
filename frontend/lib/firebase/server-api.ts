import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Product, Category } from "@/types";

// Тип для заявки
export interface Application {
    id: string;
    name: string;
    surname: string;
    phoneNumber: string;
    email: string;
    text?: string;
    createdAt: Date;
    status: "new" | "processing" | "completed";
}

// Инициализация только один раз
if (!getApps().length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(
                    /\\n/g,
                    "\n"
                ),
            }),
        });
    } catch (error) {
        console.error("Firebase admin initialization error:", error);
    }
}

const adminDb = getFirestore();

// ==========================================
// ТОВАРЫ
// ==========================================

export async function getProductsServer(): Promise<Product[]> {
    try {
        const snapshot = await adminDb
            .collection("products")
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                description: data.description || "",
                price: data.price || 0,
                features: data.features || [],
                categoryId: data.categoryId || "",
                images: data.images || [],
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching products (server):", error);
        return [];
    }
}

// ==========================================
// КАТЕГОРИИ
// ==========================================

export async function getCategoriesServer(): Promise<Category[]> {
    try {
        const snapshot = await adminDb
            .collection("categories")
            .orderBy("title", "asc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching categories (server):", error);
        return [];
    }
}

// ==========================================
// ЗАЯВКИ
// ==========================================

/**
 * Получить все заявки (для админки)
 */
export async function getApplicationsServer(): Promise<Application[]> {
    try {
        const snapshot = await adminDb
            .collection("applications")
            .orderBy("createdAt", "desc")
            .get();

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
            };
        });
    } catch (error) {
        console.error("Error fetching applications (server):", error);
        return [];
    }
}

/**
 * Получить заявку по ID
 */
export async function getApplicationServer(
    id: string
): Promise<Application | null> {
    try {
        const doc = await adminDb.collection("applications").doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data()!;
        return {
            id: doc.id,
            name: data.name || "",
            surname: data.surname || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            text: data.text || "",
            status: data.status || "new",
            createdAt: data.createdAt?.toDate() || new Date(),
        };
    } catch (error) {
        console.error("Error fetching application (server):", error);
        return null;
    }
}
