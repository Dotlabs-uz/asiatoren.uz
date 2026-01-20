"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Video, Trash2, Edit2, Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    getAllMediaSections,
    addMediaSection,
    updateMediaSection,
    deleteMediaSection,
    getMediaSectionBySectionId,
} from "@/lib/firebase/media-sections";
import { uploadFile, deleteFileByURL } from "@/lib/firebase/storage";
import { MediaSection } from "@/types/index";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

import { SiteSection } from "@/types/index";

export const SITE_SECTIONS: SiteSection[] = [
    // Главная страница
    {
        id: "home-hero",
        pagePath: "/",
        sectionName: "Главная - Основной баннер",
        acceptedTypes: ["image", "video"],
    },
    // Страница продуктов
    {
        id: "products-banner",
        pagePath: "/products",
        sectionName: "Продукты - Баннер",
        acceptedTypes: ["image", "video"],
    },
    // Страница "О нас"
    {
        id: "about-banner",
        pagePath: "/about",
        sectionName: "О нас - Баннер",
        acceptedTypes: ["image", "video"],
    },
    // Страница контактов
    {
        id: "contacts-banner",
        pagePath: "/contacts",
        sectionName: "Контакты - Баннер",
        acceptedTypes: ["image", "video"],
    },
    // Страница каталогов
    {
        id: "catalogs-banner",
        pagePath: "/catalogs",
        sectionName: "Каталоги - Баннер",
        acceptedTypes: ["image", "video"],
    },

    // Страница проектов
    {
        id: "projects-banner",
        pagePath: "/projects",
        sectionName: "Наши проекты - Баннер",
        acceptedTypes: ["image", "video"],
    },

    // Страница новостей
    {
        id: "news-banner",
        pagePath: "/news",
        sectionName: "Новости - Баннер",
        acceptedTypes: ["image", "video"],
    },

    // Страница фестивалей
    {
        id: "festivals-banner",
        pagePath: "/festivals",
        sectionName: "Фестивали - Баннер",
        acceptedTypes: ["image", "video"],
    },

    // Страница дилеров
    {
        id: "dealers-banner",
        pagePath: "/dealers",
        sectionName: "Дилеры - Баннер",
        acceptedTypes: ["image", "video"],
    },
];

export default function MediaSectionsPage() {
    const [mediaSections, setMediaSections] = useState<MediaSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [mediaToDelete, setMediaToDelete] = useState<MediaSection | null>(
        null,
    );
    const [currentSectionId, setCurrentSectionId] = useState<string>("");
    const [existingMedia, setExistingMedia] = useState<MediaSection | null>(
        null,
    );
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(
        null,
    );
    const [filePreview, setFilePreview] = useState<string>("");
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
    const [currentTab, setCurrentTab] = useState("/");
    const { toast } = useToast();

    const [formData, setFormData] = useState<{
        mediaType: "image" | "video";
        description: string;
    }>({
        mediaType: "image",
        description: "",
    });

    useEffect(() => {
        fetchMediaSections();
    }, []);

    const resetForm = () => {
        setFormData({
            mediaType: "image",
            description: "",
        });
        setSelectedFile(null);
        setSelectedThumbnail(null);
        setFilePreview("");
        setThumbnailPreview("");
        setCurrentSectionId("");
        setExistingMedia(null);
    };

    const fetchMediaSections = async () => {
        try {
            setLoading(true);
            const data = await getAllMediaSections();
            setMediaSections(data);
        } catch (error) {
            console.error("Error fetching media sections:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить медиа-секции",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = async (sectionId: string) => {
        setCurrentSectionId(sectionId);

        // Проверяем есть ли уже медиа для этой секции
        const existing = await getMediaSectionBySectionId(sectionId);
        if (existing && existing.length > 0) {
            const media = existing[0];
            setExistingMedia(media);
            setFormData({
                mediaType: media.mediaType,
                description: media.description || "",
            });
            setFilePreview(media.mediaUrl);
            if (media.thumbnailUrl) {
                setThumbnailPreview(media.thumbnailUrl);
            }
        }

        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        resetForm();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const getSelectedSection = () => {
        return SITE_SECTIONS.find((s) => s.id === currentSectionId);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const selectedSection = getSelectedSection();
        if (!selectedSection) {
            toast({
                title: "Ошибка",
                description: "Некорректная секция",
                variant: "destructive",
            });
            return;
        }

        // Если это новое медиа, требуем файл
        if (!existingMedia && !selectedFile) {
            toast({
                title: "Ошибка",
                description: "Выберите файл",
                variant: "destructive",
            });
            return;
        }

        // Проверка типа файла
        if (selectedFile) {
            const isImage = selectedFile.type.startsWith("image/");
            const isVideo = selectedFile.type.startsWith("video/");

            if (formData.mediaType === "image" && !isImage) {
                toast({
                    title: "Ошибка",
                    description: "Выберите изображение",
                    variant: "destructive",
                });
                return;
            }

            if (formData.mediaType === "video" && !isVideo) {
                toast({
                    title: "Ошибка",
                    description: "Выберите видео",
                    variant: "destructive",
                });
                return;
            }
        }

        try {
            setSaving(true);

            let mediaUrl = existingMedia?.mediaUrl || "";
            let thumbnailUrl = existingMedia?.thumbnailUrl || "";

            // Загружаем основной файл
            if (selectedFile) {
                // Удаляем старый файл если он есть
                if (existingMedia?.mediaUrl) {
                    try {
                        await deleteFileByURL(existingMedia.mediaUrl);
                    } catch (error) {
                        console.error("Error deleting old media:", error);
                    }
                }

                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(7);
                const extension = selectedFile.name.split(".").pop();
                const folder =
                    formData.mediaType === "image" ? "images" : "videos";
                const fileName = `media-sections/${folder}/${currentSectionId}_${timestamp}_${randomStr}.${extension}`;

                mediaUrl = await uploadFile(selectedFile, fileName);
            }

            // Загружаем thumbnail для видео
            if (formData.mediaType === "video" && selectedThumbnail) {
                // Удаляем старый thumbnail если он есть
                if (existingMedia?.thumbnailUrl) {
                    try {
                        await deleteFileByURL(existingMedia.thumbnailUrl);
                    } catch (error) {
                        console.error("Error deleting old thumbnail:", error);
                    }
                }

                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(7);
                const extension = selectedThumbnail.name.split(".").pop();
                const fileName = `media-sections/thumbnails/${currentSectionId}_${timestamp}_${randomStr}.${extension}`;

                thumbnailUrl = await uploadFile(selectedThumbnail, fileName);
            }

            const mediaSectionData = {
                sectionId: currentSectionId,
                pagePath: selectedSection.pagePath,
                sectionName: selectedSection.sectionName,
                mediaType: formData.mediaType,
                mediaUrl,
                thumbnailUrl:
                    formData.mediaType === "video" ? thumbnailUrl : "",
                description: formData.description,
                order: 0,
            };

            if (existingMedia) {
                // Обновляем существующее
                await updateMediaSection(existingMedia.id, mediaSectionData);
                toast({
                    title: "Успешно",
                    description: "Медиа успешно обновлено",
                });
            } else {
                // Создаем новое
                await addMediaSection(mediaSectionData);
                toast({
                    title: "Успешно",
                    description: "Медиа успешно добавлено",
                });
            }

            handleCloseDialog();
            fetchMediaSections();
        } catch (error) {
            console.error("Error saving media section:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось сохранить медиа",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (media: MediaSection) => {
        setMediaToDelete(media);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!mediaToDelete) return;

        try {
            setDeleting(true);

            // Удаляем основной файл
            if (mediaToDelete.mediaUrl) {
                try {
                    await deleteFileByURL(mediaToDelete.mediaUrl);
                } catch (error) {
                    console.error("Error deleting media file:", error);
                }
            }

            // Удаляем thumbnail если есть
            if (mediaToDelete.thumbnailUrl) {
                try {
                    await deleteFileByURL(mediaToDelete.thumbnailUrl);
                } catch (error) {
                    console.error("Error deleting thumbnail:", error);
                }
            }

            // Удаляем из Firestore
            await deleteMediaSection(mediaToDelete.id);

            toast({
                title: "Успешно",
                description: "Медиа успешно удалено",
            });

            setDeleteDialogOpen(false);
            setMediaToDelete(null);
            fetchMediaSections();
        } catch (error) {
            console.error("Error deleting media section:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить медиа",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getMediaForSection = (sectionId: string) => {
        return mediaSections.find((m) => m.sectionId === sectionId);
    };

    const getSectionsForPage = (pagePath: string) => {
        return SITE_SECTIONS.filter((s) => s.pagePath === pagePath);
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <Skeleton className="h-[400px]" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Медиа-контент сайта
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-2">
                    Управление изображениями и видео на страницах сайта
                </p>
            </div>

            <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 mb-6">
                    <TabsTrigger value="/">Главная</TabsTrigger>
                    <TabsTrigger value="/products">Продукты</TabsTrigger>
                    <TabsTrigger value="/about">О нас</TabsTrigger>
                    <TabsTrigger value="/contacts">Контакты</TabsTrigger>
                    <TabsTrigger value="/catalogs">Каталоги</TabsTrigger>
                    <TabsTrigger value="/projects">Проекты</TabsTrigger>
                    <TabsTrigger value="/news">Новости</TabsTrigger>
                    <TabsTrigger value="/festivals">Фестивали</TabsTrigger>
                    <TabsTrigger value="/dealers">Дилеры</TabsTrigger>
                </TabsList>

                {["/", "/products", "/about", "/contacts", "/catalogs", "/projects", "/news", "/festivals", "/dealers"].map((pagePath) => (
                    <TabsContent key={pagePath} value={pagePath}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {getSectionsForPage(pagePath).map((section) => {
                                const media = getMediaForSection(section.id);

                                return (
                                    <Card key={section.id}>
                                        <CardContent className="p-6">
                                            <div className="mb-4">
                                                <h3 className="font-semibold text-lg mb-1">
                                                    {section.sectionName}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Поддерживается:{" "}
                                                    {section.acceptedTypes
                                                        .map((t) =>
                                                            t === "image"
                                                                ? "изображения"
                                                                : "видео",
                                                        )
                                                        .join(" или ")}
                                                </p>
                                            </div>

                                            {media ? (
                                                <div>
                                                    {/* Preview */}
                                                    <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden mb-4">
                                                        {media.mediaType ===
                                                        "image" ? (
                                                            <Image
                                                                src={
                                                                    media.mediaUrl
                                                                }
                                                                alt={
                                                                    media.description ||
                                                                    "Media"
                                                                }
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="relative w-full h-full">
                                                                {media.thumbnailUrl ? (
                                                                    <Image
                                                                        src={
                                                                            media.thumbnailUrl
                                                                        }
                                                                        alt="Video thumbnail"
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                ) : (
                                                                    <video
                                                                        src={
                                                                            media.mediaUrl
                                                                        }
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                                    <Video className="h-12 w-12 text-white" />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    {media.description && (
                                                        <p className="text-sm mb-3 line-clamp-2">
                                                            {media.description}
                                                        </p>
                                                    )}

                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                                        {media.mediaType ===
                                                        "image" ? (
                                                            <ImageIcon className="h-3 w-3" />
                                                        ) : (
                                                            <Video className="h-3 w-3" />
                                                        )}
                                                        <span className="capitalize">
                                                            {media.mediaType ===
                                                            "image"
                                                                ? "Изображение"
                                                                : "Видео"}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {formatDate(
                                                                media.createdAt,
                                                            )}
                                                        </span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() =>
                                                                handleOpenDialog(
                                                                    section.id,
                                                                )
                                                            }
                                                        >
                                                            <Edit2 className="h-4 w-4 mr-2" />
                                                            Изменить
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    media,
                                                                )
                                                            }
                                                            className="text-destructive hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg">
                                                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-3" />
                                                    <p className="text-sm text-muted-foreground mb-4">
                                                        Медиа не загружено
                                                    </p>
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleOpenDialog(
                                                                section.id,
                                                            )
                                                        }
                                                    >
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Загрузить
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            {/* Dialog создания/редактирования */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {existingMedia
                                ? "Изменить медиа"
                                : "Загрузить медиа"}
                        </DialogTitle>
                        <DialogDescription>
                            {getSelectedSection()?.sectionName}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Тип медиа */}
                        <div className="space-y-2">
                            <Label htmlFor="mediaType">Тип медиа</Label>
                            <Select
                                value={formData.mediaType}
                                onValueChange={(value: "image" | "video") =>
                                    setFormData({
                                        ...formData,
                                        mediaType: value,
                                    })
                                }
                                disabled={saving}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {getSelectedSection()?.acceptedTypes.includes(
                                        "image",
                                    ) && (
                                        <SelectItem value="image">
                                            Изображение
                                        </SelectItem>
                                    )}
                                    {getSelectedSection()?.acceptedTypes.includes(
                                        "video",
                                    ) && (
                                        <SelectItem value="video">
                                            Видео
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Файл */}
                        <div className="space-y-2">
                            <Label htmlFor="media-file">
                                {formData.mediaType === "image"
                                    ? "Изображение"
                                    : "Видео"}
                                {existingMedia &&
                                    " (оставьте пустым, чтобы не менять)"}
                            </Label>
                            <Input
                                id="media-file"
                                type="file"
                                accept={
                                    formData.mediaType === "image"
                                        ? "image/*"
                                        : "video/*"
                                }
                                onChange={handleFileChange}
                                disabled={saving}
                            />
                            {filePreview && (
                                <div className="relative w-full h-48 mt-2 rounded-lg overflow-hidden border">
                                    {formData.mediaType === "image" ? (
                                        <Image
                                            src={filePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <video
                                            src={filePreview}
                                            controls
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                {formData.mediaType === "image"
                                    ? "Рекомендуемый размер: 1920x1080px. Максимум: 5MB."
                                    : "Максимум: 50MB. Поддерживаемые форматы: MP4, WebM"}
                            </p>
                        </div>

                        {/* Thumbnail для видео */}
                        {formData.mediaType === "video" && (
                            <div className="space-y-2">
                                <Label htmlFor="thumbnail">
                                    Превью видео (необязательно)
                                </Label>
                                <Input
                                    id="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleThumbnailChange}
                                    disabled={saving}
                                />
                                {thumbnailPreview && (
                                    <div className="relative w-full h-32 mt-2 rounded-lg overflow-hidden border">
                                        <Image
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Изображение для предпросмотра видео
                                </p>
                            </div>
                        )}

                        {/* Описание */}
                        {/* <div className="space-y-2">
                            <Label htmlFor="description">
                                Описание (необязательно)
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="Краткое описание медиа..."
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                                disabled={saving}
                                rows={3}
                            />
                        </div> */}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseDialog}
                                disabled={saving}
                            >
                                Отмена
                            </Button>
                            <Button type="submit" disabled={saving}>
                                {saving ? "Сохранение..." : "Сохранить"}
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
                            Вы уверены, что хотите удалить это медиа? Это
                            действие нельзя отменить.
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
