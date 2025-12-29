"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
    getAllMedia,
    addMedia,
    updateMedia,
    deleteMedia,
} from "@/lib/firebase/media";
import {
    uploadFile,
    getFileURL,
    deleteFileByURL,
} from "@/lib/firebase/storage";
import { Media, MediaFormData, MultilingualText } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { MultilingualInput } from "@/components/admin/MultilingualInput";

const emptyMultilingualText: MultilingualText = { ru: "", en: "", uz: "" };

const getLocalizedText = (
    text: MultilingualText | string,
    lang: "ru" | "en" | "uz" = "ru"
): string => {
    if (typeof text === "string") return text;
    return text[lang] || text.ru || text.en || text.uz || "";
};

export default function MediaPage() {
    const [media, setMedia] = useState<Media[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMedia, setEditingMedia] = useState<Media | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<
        "all" | "certificate" | "partner"
    >("all");
    const { toast } = useToast();

    const [formData, setFormData] = useState<{
        title: MultilingualText;
        type: "certificate" | "partner";
    }>({
        title: emptyMultilingualText,
        type: "certificate",
    });

    useEffect(() => {
        fetchMedia();
    }, []);

    useEffect(() => {
        if (isDialogOpen && editingMedia) {
            setFormData({
                title: editingMedia.title,
                type: editingMedia.type,
            });
            setImagePreview(editingMedia.imageUrl);
        } else if (isDialogOpen && !editingMedia) {
            setFormData({
                title: emptyMultilingualText,
                type: "certificate",
            });
            setImagePreview(null);
        }
    }, [isDialogOpen, editingMedia]);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const data = await getAllMedia();
            setMedia(data);
        } catch (error) {
            console.error("Error fetching media:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить медиа",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (mediaItem?: Media) => {
        if (mediaItem) {
            setEditingMedia(mediaItem);
        } else {
            setEditingMedia(null);
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingMedia(null);
        setImagePreview(null);
        setFormData({
            title: emptyMultilingualText,
            type: "certificate",
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
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

        try {
            setUploading(true);
            let imageUrl = editingMedia?.imageUrl || "";

            // Если загружено новое изображение
            const fileInput = document.getElementById(
                "image-upload"
            ) as HTMLInputElement;
            const file = fileInput?.files?.[0];

            if (file) {
                // Удаляем старое изображение если редактируем
                if (editingMedia?.imageUrl) {
                    try {
                        await deleteFileByURL(editingMedia.imageUrl);
                    } catch (error) {
                        console.error("Error deleting old image:", error);
                    }
                }

                // Загружаем новое изображение
                const timestamp = Date.now();
                const fileName = `${timestamp}_${file.name}`;
                const path = `media/${formData.type}/${fileName}`;

                await uploadFile(file, path);
                imageUrl = await getFileURL(path);
            }

            if (editingMedia) {
                // Редактирование
                await updateMedia(editingMedia.id, {
                    title: formData.title,
                    type: formData.type,
                    imageUrl,
                });
                toast({
                    title: "Успешно",
                    description: "Медиа успешно обновлено",
                });
            } else {
                // Создание
                if (!imageUrl) {
                    toast({
                        title: "Ошибка",
                        description: "Загрузите изображение",
                        variant: "destructive",
                    });
                    return;
                }

                await addMedia({
                    title: formData.title,
                    type: formData.type,
                    imageUrl,
                });
                toast({
                    title: "Успешно",
                    description: "Медиа успешно создано",
                });
            }

            handleCloseDialog();
            fetchMedia();
        } catch (error) {
            console.error("Error saving media:", error);
            toast({
                title: "Ошибка",
                description: editingMedia
                    ? "Не удалось обновить медиа"
                    : "Не удалось создать медиа",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteClick = (mediaItem: Media) => {
        setMediaToDelete(mediaItem);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!mediaToDelete) return;

        try {
            setDeleting(true);

            // Удаляем изображение из Storage
            if (mediaToDelete.imageUrl) {
                try {
                    await deleteFileByURL(mediaToDelete.imageUrl);
                } catch (error) {
                    console.error("Error deleting image:", error);
                }
            }

            // Удаляем запись из Firestore
            await deleteMedia(mediaToDelete.id);

            toast({
                title: "Успешно",
                description: "Медиа успешно удалено",
            });

            setDeleteDialogOpen(false);
            setMediaToDelete(null);
            fetchMedia();
        } catch (error) {
            console.error("Error deleting media:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить медиа",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
        }
    };

    const filteredMedia =
        activeTab === "all" ? media : media.filter((m) => m.type === activeTab);

    if (loading) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <Skeleton className="h-8 w-48 mb-6" />
                <Skeleton className="h-[400px]" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Медиа
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-2">
                        Управление сертификатами и партнёрами
                    </p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить
                </Button>
            </div>

            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as any)}
                className="mb-6"
            >
                <TabsList>
                    <TabsTrigger value="all">Все ({media.length})</TabsTrigger>
                    <TabsTrigger value="certificate">
                        Сертификаты (
                        {media.filter((m) => m.type === "certificate").length})
                    </TabsTrigger>
                    <TabsTrigger value="partner">
                        Партнёры (
                        {media.filter((m) => m.type === "partner").length})
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        Медиа не найдено
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Добавьте первый элемент
                    </p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredMedia.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="relative aspect-[3/4] bg-gray-100">
                                <Image
                                    src={item.imageUrl}
                                    alt={getLocalizedText(item.title, "ru")}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                />
                            </div>
                            <div className="p-3">
                                <p className="font-medium text-sm truncate">
                                    {getLocalizedText(item.title, "ru")}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    🇬🇧 {getLocalizedText(item.title, "en") || "—"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    🇺🇿 {getLocalizedText(item.title, "uz") || "—"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {item.type === "certificate"
                                        ? "Сертификат"
                                        : "Партнёр"}
                                </p>
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleOpenDialog(item)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleDeleteClick(item)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dialog создания/редактирования */}
            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) handleCloseDialog();
                }}
            >
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingMedia
                                ? "Редактировать медиа"
                                : "Добавить медиа"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMedia
                                ? "Обновите информацию о медиа на всех языках"
                                : "Загрузите изображение и укажите название на всех языках"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Мультиязычное название */}
                        <MultilingualInput
                            label="Название"
                            value={formData.title}
                            onChange={(title) =>
                                setFormData({ ...formData, title })
                            }
                            required
                            placeholder={{
                                ru: "Введите название",
                                en: "Enter title",
                                uz: "Nomini kiriting",
                            }}
                        />

                        {/* Тип */}
                        <div className="space-y-2">
                            <Label>
                                Тип <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value: "certificate" | "partner") =>
                                    setFormData({ ...formData, type: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите тип" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="certificate">
                                        Сертификат
                                    </SelectItem>
                                    <SelectItem value="partner">
                                        Партнёр
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Изображение */}
                        <div className="space-y-2">
                            <Label htmlFor="image-upload">
                                Изображение
                                {!editingMedia && (
                                    <span className="text-red-500 ml-1">*</span>
                                )}
                            </Label>
                            <Input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden border">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseDialog}
                                disabled={uploading}
                            >
                                Отмена
                            </Button>
                            <Button type="submit" disabled={uploading}>
                                {uploading ? "Сохранение..." : "Сохранить"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Dialog удаления */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Подтвердите удаление
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Вы уверены, что хотите удалить &quot;
                            {mediaToDelete
                                ? getLocalizedText(mediaToDelete.title, "ru")
                                : ""}
                            &quot;? Это действие нельзя отменить.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>
                            Отмена
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? "Удаление..." : "Удалить"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}