"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { getProducts, getProductById } from "@/lib/firebase/public-api";

export function useProducts(options?: {
    categoryId?: string;
    limit?: number;
    featured?: boolean;
}) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getProducts(options);
                setProducts(data);
            } catch (err) {
                console.error("Error in useProducts:", err);
                setError("Не удалось загрузить товары");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [options?.categoryId, options?.limit, options?.featured]);

    return { products, loading, error };
}

export function useProduct(id: string | null) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Error in useProduct:", err);
                setError("Не удалось загрузить товар");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return { product, loading, error };
}
