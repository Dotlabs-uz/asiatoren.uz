"use client";

import { useEffect, useState } from "react";
import { Plus, FileText, Trash2, Download } from "lucide-react";
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
    getAllCatalogs,
    addCatalog,
    deleteCatalog,
} from "@/lib/firebase/catalogs";
import { uploadFile, deleteFileByURL } from "@/lib/firebase/storage";
import { Catalog } from "@/types/index";
import { Skeleton } from "@/components/ui/skeleton";

export default function CatalogsPage() {
    const [catalogs, setCatalogs] = useState<Catalog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [catalogToDelete, setCatalogToDelete] = useState<Catalog | null>(
        null
    );
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState<{
        name: string;
    }>({
        name: "",
    });

    useEffect(() => {
        fetchCatalogs();
    }, []);

    useEffect(() => {
        setFormData({
            name: "",
        });
        setSelectedFile(null);
        setSelectedImage(null);
        setImagePreview(null);
    }, [isDialogOpen, catalogs]);

    const fetchCatalogs = async () => {
        try {
            setLoading(true);
            const data = await getAllCatalogs();
            setCatalogs(data);
        } catch (error) {
            console.error("Error fetching catalogs:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить каталоги",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setSelectedFile(null);
        setSelectedImage(null);
        setImagePreview(null);
        setFormData({
            name: "",
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast({
                title: "Ошибка",
                description: "Введите название каталога",
                variant: "destructive",
            });
            return;
        }

        if (!selectedFile) {
            toast({
                title: "Ошибка",
                description: "Выберите файл каталога",
                variant: "destructive",
            });
            return;
        }

        try {
            setSaving(true);

            let imageUrl = "";

            // Загружаем изображение обложки (если есть)
            if (selectedImage) {
                const imageTimestamp = Date.now();
                const imageRandomStr = Math.random().toString(36).substring(7);
                const imageExtension = selectedImage.name.split(".").pop();
                const imageFileName = `catalogs/covers/${imageTimestamp}_${imageRandomStr}.${imageExtension}`;

                imageUrl = await uploadFile(selectedImage, imageFileName);
            }

            // Загружаем файл каталога
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(7);
            const extension = selectedFile.name.split(".").pop();
            const fileName = `catalogs/${timestamp}_${randomStr}.${extension}`;

            const fileUrl = await uploadFile(selectedFile, fileName);

            const catalogData = {
                name: formData.name,
                imageUrl,
                fileUrl,
                fileName,
                fileType: selectedFile.type,
                fileSize: selectedFile.size,
            };

            await addCatalog(catalogData);
            toast({
                title: "Успешно",
                description: "Каталог успешно создан",
            });

            handleCloseDialog();
            fetchCatalogs();
        } catch (error) {
            console.error("Error saving catalog:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось создать каталог",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (catalog: Catalog) => {
        setCatalogToDelete(catalog);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!catalogToDelete) return;

        try {
            setDeleting(true);

            // Удаляем файл из Storage
            if (catalogToDelete.fileUrl) {
                try {
                    await deleteFileByURL(catalogToDelete.fileUrl);
                } catch (error) {
                    console.error("Error deleting file:", error);
                }
            }

            // Удаляем каталог из Firestore
            await deleteCatalog(catalogToDelete.id);

            toast({
                title: "Успешно",
                description: "Каталог успешно удален",
            });

            setDeleteDialogOpen(false);
            setCatalogToDelete(null);
            fetchCatalogs();
        } catch (error) {
            console.error("Error deleting catalog:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить каталог",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
        );
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
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
                        Каталоги
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-2">
                        Управление каталогами продукции
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="w-full md:w-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить каталог
                </Button>
            </div>

            {catalogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        Каталогов пока нет
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Создайте первый каталог продукции
                    </p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить каталог
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catalogs.map((catalog) => (
                        <div
                            key={catalog.id}
                            className="relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Изображение обложки */}
                            {catalog.imageUrl ? (
                                <div className="relative w-full h-48 bg-muted">
                                    <Image
                                        src={catalog.imageUrl}
                                        alt={catalog.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-48 bg-muted flex items-center justify-center">
                                    <FileText className="h-16 w-16 text-muted-foreground" />
                                </div>
                            )}

                            {/* Контент карточки */}
                            <div className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg line-clamp-2">
                                            {catalog.name}
                                        </h3>
                                    </div>
                                </div>

                                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                    <p>
                                        Размер:{" "}
                                        {formatFileSize(catalog.fileSize)}
                                    </p>
                                    <p className="capitalize">
                                        Формат:{" "}
                                        {catalog.fileType.split("/")[1] ||
                                            "unknown"}
                                    </p>
                                    <p>
                                        Создан: {formatDate(catalog.createdAt)}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        asChild
                                    >
                                        <a
                                            href={catalog.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Скачать
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteClick(catalog)
                                        }
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Dialog создания */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Добавить каталог</DialogTitle>
                        <DialogDescription>
                            Загрузите файл каталога и укажите его название
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Изображение обложки */}
                        <div className="space-y-2">
                            <Label htmlFor="catalog-image">
                                Изображение обложки (необязательно)
                            </Label>
                            <Input
                                id="catalog-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={saving}
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
                                Рекомендуемый размер: 800x600px. Максимум: 5MB.
                            </p>
                        </div>

                        {/* Название */}
                        <div className="space-y-2">
                            <Label htmlFor="catalog-name">
                                Название каталога
                            </Label>
                            <Input
                                id="catalog-name"
                                placeholder="Например: Каталог продукции 2024"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                disabled={saving}
                            />
                        </div>

                        {/* Файл */}
                        <div className="space-y-2">
                            <Label htmlFor="catalog-file">Файл каталога</Label>
                            <Input
                                id="catalog-file"
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx"
                                onChange={handleFileChange}
                                disabled={saving}
                            />
                            {selectedFile && (
                                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(selectedFile.size)}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Поддерживаемый формат: PDF. Максимум: 20MB
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
                                {saving ? "Загрузка..." : "Сохранить"}
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
                            Вы уверены, что хотите удалить каталог &quot;
                            {catalogToDelete?.name}&quot;? Это действие нельзя
                            отменить.
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
