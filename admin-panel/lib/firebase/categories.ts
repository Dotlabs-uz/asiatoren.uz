import { getItems, addItem, updateItem, deleteItem } from "./db";
import { Category, MultilingualText } from "@/types";

/**
 * Get all categories
 */
export const getCategories = async (): Promise<Category[]> => {
    try {
        const data = await getItems("categories");
        return data.map((item: any) => ({
            id: item.id,
            title: item.title || { ru: "", en: "", uz: "" },
            createdAt: item.createdAt?.toDate?.() || item.createdAt,
            updatedAt: item.updatedAt?.toDate?.() || item.updatedAt,
        })) as Category[];
    } catch (error) {
        throw error;
    }
};

/**
 * Add a new category
 */
export const addCategory = async (title: MultilingualText): Promise<string> => {
    try {
        const data = {
            title,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return await addItem("categories", data);
    } catch (error) {
        throw error;
    }
};

/**
 * Update a category
 */
export const updateCategory = async (
    id: string,
    title: MultilingualText
): Promise<void> => {
    try {
        const data = {
            title,
            updatedAt: new Date(),
        };
        await updateItem("categories", id, data);
    } catch (error) {
        throw error;
    }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
    try {
        await deleteItem("categories", id);
    } catch (error) {
        throw error;
    }
};

/**
 * Check if category can be deleted (no products using this category)
 */
export const canDeleteCategory = async (
    categoryId: string
): Promise<boolean> => {
    try {
        const products = await getItems("products");
        const hasProducts = products.some(
            (product: any) => product.categoryId === categoryId
        );
        return !hasProducts;
    } catch (error) {
        throw error;
    }
};
