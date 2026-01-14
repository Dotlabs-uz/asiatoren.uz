"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { MultilingualText, OurProjectsFormData } from "@/types";
import { MultilingualInput } from "@/components/admin/MultilingualInput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadFile, deleteFileByURL } from "@/lib/firebase/storage";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,
    loading: () => <div className="h-64 bg-muted animate-pulse rounded-md" />,
});

const emptyMulti = { ru: "", en: "", uz: "" };

export default function ProjectForm({ initialData, onSubmit, onCancel }: any) {
    const [loading, setLoading] = useState(false);

    // Состояние формы
    const [formData, setFormData] = useState({
        title: initialData?.title || { ...emptyMulti },
        content: initialData?.content || { ...emptyMulti },
        previewImageUrl: initialData?.previewImageUrl || "",
        images: initialData?.images || [],
    });

    // Временные превью для новых выбранных файлов (локальные blob-ссылки)
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [previewLocalUrl, setPreviewLocalUrl] = useState<string | null>(null);
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryLocalUrls, setGalleryLocalUrls] = useState<string[]>([]);

    const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewFile(file);
            setPreviewLocalUrl(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setGalleryFiles((prev) => [...prev, ...files]);
        const newUrls = files.map((file) => URL.createObjectURL(file));
        setGalleryLocalUrls((prev) => [...prev, ...newUrls]);
    };

    const removeExistingImage = (url: string) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((img: string) => img !== url),
        }));
    };

    const removeNewGalleryImage = (index: number) => {
        setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
        setGalleryLocalUrls((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let finalPreviewUrl = formData.previewImageUrl;
            let finalGalleryUrls = [...formData.images];

            // 1. Загрузка превью, если выбрано новое
            if (previewFile) {
                const path = `our-projects/previews/${Date.now()}_${
                    previewFile.name
                }`;
                finalPreviewUrl = await uploadFile(previewFile, path);
            }

            // 2. Загрузка новых картинок галереи
            if (galleryFiles.length > 0) {
                const uploadPromises = galleryFiles.map((file) => {
                    const path = `our-projects/gallery/${Date.now()}_${file.name}`;
                    return uploadFile(file, path);
                });
                const uploadedUrls = await Promise.all(uploadPromises);
                finalGalleryUrls = [...finalGalleryUrls, ...uploadedUrls];
            }

            // 3. Отправка итоговых данных в Firestore
            await onSubmit({
                ...formData,
                previewImageUrl: finalPreviewUrl,
                images: finalGalleryUrls,
            });
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-6 rounded-xl border shadow-sm"
        >
            <MultilingualInput
                label="Заголовок проекта"
                value={formData.title}
                onChange={(title) => setFormData({ ...formData, title })}
                required
            />

            <div className="space-y-4">
                <Label className="text-base font-semibold">
                    Контент проекта
                </Label>
                <Tabs
                    defaultValue="ru"
                    className="w-full border rounded-lg p-4"
                >
                    <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
                        <TabsTrigger value="ru">Русский</TabsTrigger>
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="uz">O'zbek</TabsTrigger>
                    </TabsList>
                    {(["ru", "en", "uz"] as const).map((lang) => (
                        <TabsContent
                            key={lang}
                            value={lang}
                            className="min-h-[350px]"
                        >
                            <ReactQuill
                                theme="snow"
                                value={formData.content[lang]}
                                onChange={(val) =>
                                    setFormData((p) => ({
                                        ...p,
                                        content: { ...p.content, [lang]: val },
                                    }))
                                }
                                className="h-64 mb-12"
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Секция Preview Image */}
                <div className="space-y-3">
                    <Label className="font-semibold">
                        Главное изображение (Preview)
                    </Label>
                    <div className="relative aspect-video rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden bg-muted">
                        {previewLocalUrl || formData.previewImageUrl ? (
                            <>
                                <Image
                                    src={
                                        previewLocalUrl ||
                                        formData.previewImageUrl
                                    }
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-2 right-2 h-8 w-8"
                                    onClick={() => {
                                        setPreviewFile(null);
                                        setPreviewLocalUrl(null);
                                        setFormData({
                                            ...formData,
                                            previewImageUrl: "",
                                        });
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <label className="flex flex-col items-center gap-2 cursor-pointer">
                                <ImagePlus className="h-10 w-10 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Загрузить превью
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePreviewChange}
                                />
                            </label>
                        )}
                    </div>
                </div>

                {/* Секция Галереи */}
                <div className="space-y-3">
                    <Label className="font-semibold">Галерея изображений</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Существующие фото */}
                        {formData.images.map((url: string) => (
                            <div
                                key={url}
                                className="relative aspect-square rounded-md overflow-hidden border"
                            >
                                <Image
                                    src={url}
                                    alt="gallery"
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6"
                                    onClick={() => removeExistingImage(url)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                        {/* Новые выбранные фото */}
                        {galleryLocalUrls.map((url, idx) => (
                            <div
                                key={url}
                                className="relative aspect-square rounded-md overflow-hidden border border-blue-400"
                            >
                                <Image
                                    src={url}
                                    alt="new gallery"
                                    fill
                                    className="object-cover opacity-70"
                                />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6"
                                    onClick={() => removeNewGalleryImage(idx)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                        {/* Кнопка добавления */}
                        <label className="aspect-square rounded-md border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleGalleryChange}
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Отмена
                </Button>
                <Button
                    type="submit"
                    disabled={loading}
                    className="min-w-[150px]"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Загрузка...
                        </>
                    ) : (
                        "Сохранить проект"
                    )}
                </Button>
            </div>
        </form>
    );
}
