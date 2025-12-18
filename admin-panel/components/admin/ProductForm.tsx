"use client";

import { getCategories } from "@/lib/firebase/categories";
import { Category } from "@/types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { uploadFile, getFileURL } from "@/lib/firebase/storage";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

const productSchema = z.object({
    title: z
        .string()
        .min(1, "Название обязательно")
        .max(200, "Слишком длинное название"),
    description: z.string().min(1, "Описание обязательно"),
    price: z.number().min(0, "Цена должна быть положительной"),
    categoryId: z.string().min(1, "Категория обязательна"),
    stock: z.number().min(0, "Количество должно быть положительным").optional(),
    isActive: z.boolean().optional(),
    features: z.array(z.string()).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
    initialData?: {
        title: string;
        description: string;
        price: number;
        categoryId: string;
        images: string[];
        features?: string[];
    };
    onSubmit: (data: ProductFormValues & { images: string[] }) => Promise<void>;
    loading?: boolean;
}

export function ProductForm({
    initialData,
    onSubmit,
    loading = false,
}: ProductFormProps) {
    const [uploadedImages, setUploadedImages] = useState<string[]>(
        initialData?.images || []
    );
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            price: initialData?.price || 0,
            categoryId: initialData?.categoryId || "",
            features: initialData?.features ?? [""],
        },
    });

    useEffect(() => {
        if (imageFiles.length > 0) {
            const newPreviews = imageFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setImagePreviews(newPreviews);

            return () => {
                newPreviews.forEach((url) => URL.revokeObjectURL(url));
            };
        } else {
            setImagePreviews([]);
        }
    }, [imageFiles]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error loading categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategories();
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const imageFiles = files.filter((file) =>
            file.type.startsWith("image/")
        );

        if (imageFiles.length === 0) {
            return;
        }

        // Ограничение на количество изображений
        const maxImages = 10;
        const totalImages = uploadedImages.length + imageFiles.length;

        if (totalImages > maxImages) {
            alert(`Можно загрузить максимум ${maxImages} изображений`);
            return;
        }

        setImageFiles((prev) => [...prev, ...imageFiles]);
        e.target.value = ""; // Сбрасываем input
    };

    const removeImagePreview = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(imagePreviews[index]);
    };

    const removeUploadedImage = (index: number) => {
        setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (data: ProductFormValues) => {
        try {
            setUploading(true);

            // Загружаем новые изображения в Storage
            const newImageUrls: string[] = [];

            for (const file of imageFiles) {
                const timestamp = Date.now();
                const fileName = `${timestamp}_${file.name}`;
                const path = `products/${fileName}`;

                await uploadFile(file, path);
                const url = await getFileURL(path);
                newImageUrls.push(url);
            }

            // Объединяем существующие и новые изображения
            const allImages = [...uploadedImages, ...newImageUrls];

            // Вызываем onSubmit с данными формы и изображениями
            await onSubmit({
                title: data.title,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                features: data.features,
                images: allImages,
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            throw error;
        } finally {
            setUploading(false);
        }
    };

    const allImages = [...uploadedImages, ...imagePreviews];
    const isSubmitting = loading || uploading;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
            >
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Введите название товара"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Описание</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Введите описание товара"
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Цена (Sum)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseFloat(e.target.value) || 0
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {!loadingCategories ? (
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Категория</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={
                                            loadingCategories ||
                                            categories.length === 0
                                        }
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Выберите категорию" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {loadingCategories ? (
                                                <SelectItem value="" disabled>
                                                    Загрузка категорий...
                                                </SelectItem>
                                            ) : categories.length === 0 ? (
                                                <SelectItem value="" disabled>
                                                    Категории не найдены
                                                </SelectItem>
                                            ) : (
                                                categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id}
                                                    >
                                                        {category.title}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ) : (
                        <Skeleton className="w-full h-16" />
                    )}
                    {!loadingCategories && categories.length === 0 && (
                        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <p className="text-sm text-yellow-800">
                                Категории не найдены.{" "}
                                <a
                                    href="/admin/categories"
                                    className="font-medium underline hover:no-underline"
                                >
                                    Создайте первую категорию
                                </a>
                            </p>
                        </div>
                    )}
                </div>

                {/* Загрузка изображений */}
                <div className="space-y-4">
                    <p className="text-sm font-medium">Изображения</p>

                    <div className="flex items-center gap-2">
                        <label htmlFor="image-upload">
                            <Button type="button" variant="outline" asChild>
                                <span className="cursor-pointer">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Загрузить изображения
                                </span>
                            </Button>
                        </label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileSelect}
                        />
                        <p className="text-sm text-muted-foreground">
                            Можно загрузить до 10 изображений
                        </p>
                    </div>

                    {/* Preview изображений */}
                    {allImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {uploadedImages.map((url, index) => (
                                <div
                                    key={`uploaded-${index}`}
                                    className="relative group"
                                >
                                    <div className="relative aspect-square rounded-lg overflow-hidden border">
                                        <Image
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() =>
                                            removeUploadedImage(index)
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Загружено
                                    </p>
                                </div>
                            ))}
                            {imagePreviews.map((preview, index) => (
                                <div
                                    key={`preview-${index}`}
                                    className="relative group"
                                >
                                    <div className="relative aspect-square rounded-lg overflow-hidden border">
                                        <Image
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() =>
                                            removeImagePreview(index)
                                        }
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Новое
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {allImages.length === 0 && (
                        <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-12 text-center">
                            <div className="space-y-2">
                                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    Изображения не загружены
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="features"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>Характеристики</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Введите характеристики"
                                            className="min-h-[120px]"
                                            defaultValue={
                                                Array.isArray(field.value)
                                                    ? field.value.join(", ")
                                                    : ""
                                            }
                                            onBlur={(e) => {
                                                const raw = e.target.value;
                                                const parsed = raw
                                                    .split(",")
                                                    .map((s) => s.trim())
                                                    .filter(
                                                        (s) => s.length > 0
                                                    );

                                                field.onChange(parsed);
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Введите характеристики через запятую,
                                        например: практично, дешево, красиво
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        asChild
                        disabled={isSubmitting}
                    >
                        <a href="/admin/products">Отмена</a>
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || !form.formState.isValid}
                    >
                        {isSubmitting ? "Сохранение..." : "Сохранить"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
