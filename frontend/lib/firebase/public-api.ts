import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    QueryConstraint,
} from "firebase/firestore";
import { db } from "./client";
import { Product, Category } from "@/types";

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

export const getProducts = async (options?: {
    categoryId?: string;
    limit?: number;
    featured?: boolean;
}): Promise<Product[]> => {
    try {
        const productsRef = collection(db, "products");
        const constraints: QueryConstraint[] = [];

        // Фильтр по категории
        if (options?.categoryId) {
            constraints.push(where("categoryId", "==", options.categoryId));
        }

        // Фильтр по рекомендуемым
        if (options?.featured) {
            constraints.push(where("featured", "==", true));
        }

        // Сортировка только если НЕТ фильтров (чтобы избежать необходимости в индексе)
        // Если есть фильтры - сортируем на клиенте
        if (!options?.categoryId && !options?.featured) {
            constraints.push(orderBy("createdAt", "desc"));
        }

        // Лимит
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

        // Если были фильтры - сортируем на клиенте
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
        // Получаем все товары
        const allProducts = await getProducts();

        // Фильтруем на клиенте
        const query = searchQuery.toLowerCase().trim();

        return allProducts.filter((product) => {
            const titleMatch = product.title.toLowerCase().includes(query);
            const descMatch = product.description.toLowerCase().includes(query);
            const featuresMatch = product.features?.some((f) =>
                f.toLowerCase().includes(query)
            );

            return titleMatch || descMatch || featuresMatch;
        });
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
};
