import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Product, Category } from "@/types";

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