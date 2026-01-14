"use client";

import { useEffect, useState } from "react";
import { Plus, Image as ImageIcon, Trash2, Edit2 } from "lucide-react";
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
    getAllBanners,
    addBanner,
    updateBanner,
    deleteBanner,
} from "@/lib/firebase/banners";
import { uploadFile, deleteFileByURL } from "@/lib/firebase/storage";
import { Banner } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

export default function BannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState<{
        imageUrl: string;
    }>({
        imageUrl: "",
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        setFormData({
            imageUrl: "",
        });
        setImagePreview(null);
    }, [isDialogOpen, banners]);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const data = await getAllBanners();
            setBanners(data);
        } catch (error) {
            console.error("Error fetching banners:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить баннеры",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (banner?: Banner) => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setImagePreview(null);
        setFormData({
            imageUrl: "",
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

        try {
            setSaving(true);
            let imageUrl = formData.imageUrl;

            // Если загружено новое изображение
            const fileInput = document.getElementById(
                "banner-image-upload"
            ) as HTMLInputElement;
            const file = fileInput?.files?.[0];

            if (file) {
                // Загружаем новое изображение
                const timestamp = Date.now();
                const randomStr = Math.random().toString(36).substring(7);
                const extension = file.name.split(".").pop();
                const fileName = `banners/${timestamp}_${randomStr}.${extension}`;

                imageUrl = await uploadFile(file, fileName);
            }

            if (!imageUrl) {
                toast({
                    title: "Ошибка",
                    description: "Загрузите изображение баннера",
                    variant: "destructive",
                });
                return;
            }

            const bannerData = {
                imageUrl,
            };

            // Создание
            await addBanner(bannerData);
            toast({
                title: "Успешно",
                description: "Баннер успешно создан",
            });

            handleCloseDialog();
            fetchBanners();
        } catch (error) {
            console.error("Error saving banner:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось создать баннер",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (banner: Banner) => {
        setBannerToDelete(banner);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!bannerToDelete) return;

        try {
            setDeleting(true);

            // Удаляем изображение из Storage
            if (bannerToDelete.imageUrl) {
                try {
                    await deleteFileByURL(bannerToDelete.imageUrl);
                } catch (error) {
                    console.error("Error deleting image:", error);
                }
            }

            // Удаляем баннер из Firestore
            await deleteBanner(bannerToDelete.id);

            toast({
                title: "Успешно",
                description: "Баннер успешно удален",
            });

            setDeleteDialogOpen(false);
            setBannerToDelete(null);
            fetchBanners();
        } catch (error) {
            console.error("Error deleting banner:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить баннер",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="h-[400px]" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Баннеры
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-2">
                        Управление баннерами на главной странице
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="w-full md:w-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить баннер
                </Button>
            </div>

            {banners.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        Баннеров пока нет
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Создайте первый баннер для главной страницы
                    </p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить баннер
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {banners.map((banner) => (
                        <div key={banner.id} className="relative">
                            <Image
                                src={banner.imageUrl}
                                alt={`image-${banner.id}`}
                                className="object-cover w-96 h-56 rounded-md border"
                                width={1000}
                                height={500}
                            />
                            <div
                                onClick={() => handleDeleteClick(banner)}
                                className="bg-white rounded-full size-7 absolute top-2 right-2 flex items-center justify-center"
                            >
                                <Trash2 size={"20"} color="black" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dialog создания/редактирования */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Добавить баннер</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Изображение */}
                        <div className="space-y-2">
                            <Label htmlFor="banner-image-upload">
                                Изображение баннера
                            </Label>
                            <Input
                                id="banner-image-upload"
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
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Рекомендуемый размер: 1920x600px. Максимум: 5MB.
                                Формат: webp
                            </p>
                        </div>

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
                            Вы уверены, что хотите удалить баннер? Это действие
                            нельзя отменить.
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
