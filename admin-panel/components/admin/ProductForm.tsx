"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/firebase/storage";
import { getCategories } from "@/lib/firebase/categories";
import { Category, ProductFormData, MultilingualText } from "@/types";
import { MultilingualInput } from "@/components/admin/MultilingualInput";
import { MultilingualArrayInput } from "@/components/admin/MultilingualArrayInput";

interface ProductFormProps {
    initialData?: ProductFormData;
    onSubmit: (data: ProductFormData) => Promise<void>;
    loading?: boolean;
}

const emptyMultilingualText: MultilingualText = { ru: "", en: "", uz: "" };

export function ProductForm({
    initialData,
    onSubmit,
    loading = false,
}: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<ProductFormData>({
        title: initialData?.title || emptyMultilingualText,
        description: initialData?.description || emptyMultilingualText,
        categoryId: initialData?.categoryId || "",
        images: initialData?.images || [],
        features: initialData?.features || [],
    });

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error loading categories:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить категории",
                    variant: "destructive",
                });
            }
        };

        loadCategories();
    }, [toast]);

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploading(true);

            const uploadPromises = Array.from(files).map(async (file) => {
                // Валидация
                if (!file.type.startsWith("image/")) {
                    throw new Error(
                        `Файл ${file.name} не является изображением`
                    );
                }

                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(
                        `Файл ${file.name} слишком большой (максимум 5MB)`
                    );
                }

                // Генерируем уникальное имя файла
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(7);
                const extension = file.name.split(".").pop();
                const fileName = `products/${timestamp}_${randomStr}.${extension}`;

                // Загружаем файл и получаем URL
                const url = await uploadFile(file, fileName);
                return url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);

            setFormData({
                ...formData,
                images: [...formData.images, ...uploadedUrls],
            });

            toast({
                title: "Успешно",
                description: `Загружено ${uploadedUrls.length} изображений`,
            });
        } catch (error) {
            console.error("Error uploading images:", error);
            toast({
                title: "Ошибка",
                description:
                    error instanceof Error
                        ? error.message
                        : "Не удалось загрузить изображения",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
            // Очищаем input
            e.target.value = "";
        }
    };

    const removeImage = (index: number) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация
        if (!formData.title.ru || !formData.title.en || !formData.title.uz) {
            toast({
                title: "Ошибка",
                description: "Заполните название на всех языках",
                variant: "destructive",
            });
            return;
        }

        if (
            !formData.description.ru ||
            !formData.description.en ||
            !formData.description.uz
        ) {
            toast({
                title: "Ошибка",
                description: "Заполните описание на всех языках",
                variant: "destructive",
            });
            return;
        }

        if (!formData.categoryId) {
            toast({
                title: "Ошибка",
                description: "Выберите категорию",
                variant: "destructive",
            });
            return;
        }

        // Убедимся, что features - это массив (может быть пустым)
        const cleanedData: ProductFormData = {
            title: formData.title,
            description: formData.description,
            categoryId: formData.categoryId,
            images: formData.images,
            features: formData.features || [], // Всегда массив, даже если пустой
        };

        try {
            await onSubmit(cleanedData);
        } catch (error) {
            // Ошибка обрабатывается в родительском компоненте
        }
    };

    const getLocalizedText = (
        text: MultilingualText | string,
        lang: "ru" | "en" | "uz" = "ru"
    ): string => {
        if (typeof text === "string") return text;
        return text[lang] || text.ru || text.en || text.uz || "";
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Название */}
            <MultilingualInput
                label="Название товара"
                value={formData.title}
                onChange={(title) => setFormData({ ...formData, title })}
                required
                placeholder={{
                    ru: "Введите название товара",
                    en: "Enter product name",
                    uz: "Mahsulot nomini kiriting",
                }}
            />

            {/* Описание */}
            <MultilingualInput
                label="Описание"
                value={formData.description}
                onChange={(description) =>
                    setFormData({ ...formData, description })
                }
                type="textarea"
                required
                placeholder={{
                    ru: "Введите описание товара",
                    en: "Enter product description",
                    uz: "Mahsulot tavsifini kiriting",
                }}
            />

            {/* Цена и категория */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Категория */}
                <div className="space-y-2">
                    <Label htmlFor="category">
                        Категория <span className="text-red-500">*</span>
                    </Label>
                    <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                            setFormData({ ...formData, categoryId: value })
                        }
                    >
                        <SelectTrigger id="category">
                            <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category.id}
                                    value={category.id}
                                >
                                    <div className="flex items-center gap-2">
                                        <span>
                                            🇷🇺{" "}
                                            {getLocalizedText(
                                                category.title,
                                                "ru"
                                            )}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            / 🇬🇧{" "}
                                            {getLocalizedText(
                                                category.title,
                                                "en"
                                            )}
                                            / 🇺🇿{" "}
                                            {getLocalizedText(
                                                category.title,
                                                "uz"
                                            )}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Характеристики */}
            <MultilingualArrayInput
                label="Характеристики товара"
                value={formData.features}
                onChange={(features) => setFormData({ ...formData, features })}
                placeholder="Введите характеристику"
            />

            {/* Изображения */}
            <div className="space-y-2">
                <Label>Изображения товара</Label>
                <div className="space-y-4">
                    {/* Загруженные изображения */}
                    {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {formData.images.map((url, index) => (
                                <Card key={index} className="relative group">
                                    <CardContent className="p-2">
                                        <div className="aspect-square relative rounded-md overflow-hidden">
                                            <img
                                                src={url}
                                                alt={`Изображение ${index + 1}`}
                                                className="object-cover w-full h-full"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() =>
                                                    removeImage(index)
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Кнопка загрузки */}
                    <div>
                        <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploading}
                            className="hidden"
                            id="image-upload"
                        />
                        <Label htmlFor="image-upload">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={uploading}
                                className="w-full cursor-pointer"
                                asChild
                            >
                                <span>
                                    {uploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Загрузка...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Загрузить изображения
                                        </>
                                    )}
                                </span>
                            </Button>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-2">
                            Максимальный размер файла: 5MB. Форматы: JPG, PNG,
                            GIF, WEBP
                        </p>
                    </div>
                </div>
            </div>

            {/* Кнопки */}
            <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading || uploading}
                >
                    Отмена
                </Button>
                <Button type="submit" disabled={loading || uploading}>
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Сохранение...
                        </>
                    ) : (
                        "Сохранить"
                    )}
                </Button>
            </div>
        </form>
    );
}
