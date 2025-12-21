"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { getCategories } from "@/lib/firebase/public-api";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error("Error in useCategories:", err);
                setError("Не удалось загрузить категории");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return { categories, loading, error };
}
