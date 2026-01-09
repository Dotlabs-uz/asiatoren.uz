"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/admin/ProductForm";
import { addProduct } from "@/lib/firebase/products";
import { ProductFormData } from "@/types";

export default function NewProductPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: ProductFormData) => {
        try {
            setLoading(true);

            await addProduct(data);

            toast({
                title: "Успешно",
                description: "Товар успешно создан",
            });

            router.push("/products");
        } catch (error) {
            console.error("Error creating product:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось создать товар",
                variant: "destructive",
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Добавить товар
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-2">
                    Заполните форму для добавления нового товара на всех языках
                </p>
            </div>

            <div className="max-w-4xl">
                <ProductForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
}
