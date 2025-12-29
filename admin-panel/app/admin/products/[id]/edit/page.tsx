"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProduct, updateProduct } from "@/lib/firebase/products";
import { Product, ProductFormData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [product, setProduct] = useState<Product | null>(null);

    const productId = params.id as string;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProduct(productId);

                if (!data) {
                    toast({
                        title: "Ошибка",
                        description: "Товар не найден",
                        variant: "destructive",
                    });
                    router.push("/admin/products");
                    return;
                }

                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить товар",
                    variant: "destructive",
                });
                router.push("/admin/products");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchProduct();
        }
    }, [productId, router, toast]);

    const handleSubmit = async (data: ProductFormData) => {
        try {
            setSaving(true);

            await updateProduct(productId, data);

            toast({
                title: "Успешно",
                description: "Товар успешно обновлен",
            });

            router.push("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось обновить товар",
                variant: "destructive",
            });
            throw error;
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <div className="mb-6">
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="max-w-4xl space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <div className="flex justify-end gap-4">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Редактировать товар
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-2">
                    Обновите информацию о товаре на всех языках
                </p>
            </div>

            <div className="max-w-4xl">
                <ProductForm
                    initialData={{
                        title: product.title,
                        description: product.description,
                        price: product.price,
                        categoryId: product.categoryId,
                        images: product.images || [],
                        features: product.features || [],
                    }}
                    onSubmit={handleSubmit}
                    loading={saving}
                />
            </div>
        </div>
    );
}
