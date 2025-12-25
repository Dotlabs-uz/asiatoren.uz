import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    QueryConstraint,
} from "firebase/firestore";
import { db } from "./client";
import { Product, Category, ApplicationFormData, Media } from "@/types";

export const getCategories = async (): Promise<Category[]> => {
    try {
        const categoriesRef = collection(db, "categories");
        const q = query(categoriesRef, orderBy("title", "asc"));

        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title || "",
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        }));
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
    try {
        const categoryRef = doc(db, "categories", id);
        const snapshot = await getDoc(categoryRef);

        if (!snapshot.exists()) {
            return null;
        }

        const data = snapshot.data();
        return {
            id: snapshot.id,
            title: data.title || "",
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        };
    } catch (error) {
        console.error("Error fetching category:", error);
        return null;
    }
};

// ==========================================
// ТОВАРЫ
// ==========================================

export const getProducts = async (options?: {
    categoryId?: string;
    limit?: number;
    featured?: boolean;
}): Promise<Product[]> => {
    try {
        const productsRef = collection(db, "products");
        const constraints: QueryConstraint[] = [];

        if (options?.categoryId) {
            constraints.push(where("categoryId", "==", options.categoryId));
        }

        if (options?.featured) {
            constraints.push(where("featured", "==", true));
        }

        if (!options?.categoryId && !options?.featured) {
            constraints.push(orderBy("createdAt", "desc"));
        }

        if (options?.limit) {
            constraints.push(limit(options.limit));
        }

        const q = query(productsRef, ...constraints);
        const snapshot = await getDocs(q);

        let products = snapshot.docs.map((doc) => {
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

        if (options?.categoryId || options?.featured) {
            products = products.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );
        }

        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

export const getProductById = async (id: string): Promise<Product | null> => {
    try {
        const productRef = doc(db, "products", id);
        const snapshot = await getDoc(productRef);

        if (!snapshot.exists()) {
            return null;
        }

        const data = snapshot.data();
        return {
            id: snapshot.id,
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
        console.error("Error fetching product:", error);
        return null;
    }
};

export const getFeaturedProducts = async (
    limitCount: number = 6
): Promise<Product[]> => {
    return getProducts({ featured: true, limit: limitCount });
};

export const getProductsByCategory = async (
    categoryId: string,
    limitCount?: number
): Promise<Product[]> => {
    return getProducts({ categoryId, limit: limitCount });
};

export const searchProducts = async (
    searchQuery: string
): Promise<Product[]> => {
    try {
        const allProducts = await getProducts();
        const query = searchQuery.toLowerCase().trim();

        return allProducts.filter((product) => {
            const nameMatch = product.title.toLowerCase().includes(query);
            const descMatch = product.description.toLowerCase().includes(query);
            const featuresMatch = product.features?.some((f) =>
                f.toLowerCase().includes(query)
            );

            return nameMatch || descMatch || featuresMatch;
        });
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
};

// ==========================================
// ЗАЯВКИ
// ==========================================

/**
 * Создать новую заявку
 */
export const createApplication = async (
    data: ApplicationFormData
): Promise<string> => {
    try {
        const applicationsRef = collection(db, "applications");

        const applicationData = {
            name: data.name,
            surname: data.surname,
            phoneNumber: data.phoneNumber,
            email: data.email,
            text: data.text || "",
            status: "new",
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(applicationsRef, applicationData);
        return docRef.id;
    } catch (error) {
        console.error("Error creating application:", error);
        throw error;
    }
};

/**
 * Получить все сертификаты
 */
export const getCertificates = async (): Promise<Media[]> => {
    try {
        const mediaRef = collection(db, "media");
        const q = query(
            mediaRef,
            where("type", "==", "certificate"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                imageUrl: data.imageUrl || "",
                type: "certificate",
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching certificates:", error);
        return [];
    }
};

/**
 * Получить всех партнёров
 */
export const getPartners = async (): Promise<Media[]> => {
    try {
        const mediaRef = collection(db, "media");
        const q = query(
            mediaRef,
            where("type", "==", "partner"),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title || "",
                imageUrl: data.imageUrl || "",
                type: "partner",
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            };
        });
    } catch (error) {
        console.error("Error fetching partners:", error);
        return [];
    }
};

