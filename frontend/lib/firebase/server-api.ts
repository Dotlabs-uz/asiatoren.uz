import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Product, Category, Media, Application } from "@/types";

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

/**
 * Получить товар по ID
 */
export async function getProductServer(id: string): Promise<Product | null> {
    try {
        const doc = await adminDb.collection("products").doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data()!;
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
    } catch (error) {
        console.error("Error fetching product (server):", error);
        return null;
    }
}

/**
 * Получить товары по категории
 */
export async function getProductsByCategoryServer(
    categoryId: string
): Promise<Product[]> {
    try {
        const snapshot = await adminDb
            .collection("products")
            .where("categoryId", "==", categoryId)
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
        console.error("Error fetching products by category (server):", error);
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

/**
 * Получить категорию по ID
 */
export async function getCategoryServer(id: string): Promise<Category | null> {
    try {
        const doc = await adminDb.collection("categories").doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data()!;
        return {
            id: doc.id,
            title: data.title || "",
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    } catch (error) {
        console.error("Error fetching category (server):", error);
        return null;
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

// ==========================================
// МЕДИА (Сертификаты и Партнёры)
// ==========================================

/**
 * Получить все сертификаты
 */
export async function getCertificatesServer(): Promise<Media[]> {
    try {
        const snapshot = await adminDb
            .collection("media")
            .where("type", "==", "certificate")
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                imageUrl: data.imageUrl || "",
                type: "certificate" as const,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching certificates (server):", error);
        return [];
    }
}

/**
 * Получить всех партнёров
 */
export async function getPartnersServer(): Promise<Media[]> {
    try {
        const snapshot = await adminDb
            .collection("media")
            .where("type", "==", "partner")
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                imageUrl: data.imageUrl || "",
                type: "partner" as const,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching partners (server):", error);
        return [];
    }
}

/**
 * Получить все медиа (сертификаты + партнёры)
 */
export async function getAllMediaServer(): Promise<Media[]> {
    try {
        const snapshot = await adminDb
            .collection("media")
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                imageUrl: data.imageUrl || "",
                type: (data.type || "certificate") as "certificate" | "partner",
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching all media (server):", error);
        return [];
    }
}

/**
 * Получить медиа по ID
 */
export async function getMediaServer(id: string): Promise<Media | null> {
    try {
        const doc = await adminDb.collection("media").doc(id).get();

        if (!doc.exists) {
            return null;
        }

        const data = doc.data()!;
        return {
            id: doc.id,
            title: data.title || "",
            imageUrl: data.imageUrl || "",
            type: (data.type || "certificate") as "certificate" | "partner",
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    } catch (error) {
        console.error("Error fetching media (server):", error);
        return null;
    }
}
