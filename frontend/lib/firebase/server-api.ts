import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
    Product,
    Category,
    Media,
    Application,
    OurProjects,
    News,
    Festival,
    Dealer,
    Video,
    Banner,
    Catalog,
    MediaSection,
} from "@/types";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

// Инициализация только один раз
if (!getApps().length) {
    try {
        initializeApp({
            credential: cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(
                    /\\n/g,
                    "\n",
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
    categoryId: string,
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
    id: string,
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

// ==========================================
// ПРОЕКТЫ (Our Projects)
// ==========================================

export async function getBannersServer(): Promise<Banner[]> {
    try {
        const snapshot = await adminDb
            .collection("banners")
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                imageUrl: data.imageUrl,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching projects (server):", error);
        return [];
    }
}

// ==========================================
// Каталоги
// ==========================================

export async function getCatalogsServer(): Promise<Catalog[]> {
    try {
        const snapshot = await adminDb
            .collection("catalogs")
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                imageUrl: data.imageUrl,
                fileUrl: data.fileUrl,
                fileName: data.fileName,
                fileType: data.fileType,
                fileSize: data.fileSize,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching catalogs (server):", error);
        return [];
    }
}

export async function getProjectsServer(): Promise<OurProjects[]> {
    try {
        const snapshot = await adminDb
            .collection("our-projects")
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || { ru: "", en: "", uz: "" },
                content: data.content || { ru: "", en: "", uz: "" },
                previewImageUrl: data.previewImageUrl || "",
                images: data.images || [],
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching projects (server):", error);
        return [];
    }
}

// ==========================================
// НОВОСТИ (News)
// ==========================================

export async function getNewsServer(): Promise<News[]> {
    try {
        const snapshot = await adminDb
            .collection("news")
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || { ru: "", en: "", uz: "" },
                content: data.content || { ru: "", en: "", uz: "" },
                previewImageUrl: data.previewImageUrl || "",
                images: data.images || [],
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching news (server):", error);
        return [];
    }
}

// ==========================================
// ФЕСТИВАЛИ (Festivals)
// ==========================================

export async function getFestivalsServer(): Promise<Festival[]> {
    try {
        const snapshot = await adminDb
            .collection("festivals")
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || { ru: "", en: "", uz: "" },
                content: data.content || { ru: "", en: "", uz: "" },
                previewImageUrl: data.previewImageUrl || "",
                images: data.images || [],
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching festivals (server):", error);
        return [];
    }
}

// ==========================================
// ДИЛЕРЫ (Our Dealers)
// ==========================================

export async function getDealersServer(): Promise<Dealer[]> {
    try {
        const snapshot = await adminDb
            .collection("our-dealers")
            .orderBy("createdAt", "asc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || { ru: "", en: "", uz: "" },
                logoUrl: data.logoUrl || "",
                addresses: data.addresses || [],
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching dealers (server):", error);
        return [];
    }
}

// ==========================================
// ВИДЕО (Videos)
// ==========================================

export async function getVideosServer(): Promise<Video[]> {
    try {
        const snapshot = await adminDb
            .collection("videos")
            .orderBy("createdAt", "desc")
            .get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || { ru: "", en: "", uz: "" },
                videoUrl: data.videoUrl || "",
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching videos (server):", error);
        return [];
    }
}

/**
 * Получить проект по ID
 */
export async function getProjectByIdServer(
    id: string,
): Promise<OurProjects | null> {
    try {
        const doc = await adminDb.collection("our-projects").doc(id).get();
        if (!doc.exists) return null;

        const data = doc.data()!;
        return {
            id: doc.id,
            title: data.title || { ru: "", en: "", uz: "" },
            content: data.content || { ru: "", en: "", uz: "" },
            previewImageUrl: data.previewImageUrl || "",
            images: data.images || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    } catch (error) {
        console.error(`Error fetching project ${id}:`, error);
        return null;
    }
}

/**
 * Получить новость по ID
 */
export async function getNewsByIdServer(id: string): Promise<News | null> {
    try {
        const doc = await adminDb.collection("news").doc(id).get();
        if (!doc.exists) return null;

        const data = doc.data()!;
        return {
            id: doc.id,
            title: data.title || { ru: "", en: "", uz: "" },
            content: data.content || { ru: "", en: "", uz: "" },
            previewImageUrl: data.previewImageUrl || "",
            images: data.images || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    } catch (error) {
        console.error(`Error fetching news ${id}:`, error);
        return null;
    }
}

/**
 * Получить фестиваль по ID
 */
export async function getFestivalByIdServer(
    id: string,
): Promise<Festival | null> {
    try {
        const doc = await adminDb.collection("festivals").doc(id).get();
        if (!doc.exists) return null;

        const data = doc.data()!;
        return {
            id: doc.id,
            title: data.title || { ru: "", en: "", uz: "" },
            content: data.content || { ru: "", en: "", uz: "" },
            previewImageUrl: data.previewImageUrl || "",
            images: data.images || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    } catch (error) {
        console.error(`Error fetching festival ${id}:`, error);
        return null;
    }
}

/**
 * Получить медиа-секцию по ID секции (Server-side)
 */
export async function getMediaSectionBySectionId(
    sectionId: string,
): Promise<MediaSection[]> {
    try {
        const snapshot = await adminDb
            .collection("media-sections")
            .where("sectionId", "==", sectionId)
            .orderBy("order", "asc")
            .get();

        return snapshot.docs.map((doc) => {
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
                order: data.order || 0,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error getting media section by sectionId:", error);
        return [];
    }
}
