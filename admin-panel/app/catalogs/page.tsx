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
import { Catalog, MultilingualText } from "@/types/index";
import { Skeleton } from "@/components/ui/skeleton";
import { MultilingualInput } from "@/components/admin/MultilingualInput";

const emptyMultilingual: MultilingualText = { ru: "", en: "", uz: "" };

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
        name: MultilingualText;
    }>({
        name: emptyMultilingual,
    });

    useEffect(() => {
        fetchCatalogs();
    }, []);

    const getLocalizedName = (
        name: MultilingualText | string,
        lang: keyof MultilingualText = "ru"
    ) => {
        if (typeof name === "string") return name;
        return name[lang] || name.ru || "";
    };

    useEffect(() => {
        if (!isDialogOpen) {
            setFormData({ name: emptyMultilingual });
            setSelectedFile(null);
            setSelectedImage(null);
            setImagePreview(null);
        }
    }, [isDialogOpen]);

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
            name: emptyMultilingual,
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

        // Валидация мультиязычного имени
        if (!formData.name.ru || !formData.name.en || !formData.name.uz) {
            toast({
                title: "Ошибка",
                description: "Заполните название на всех языках",
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

            if (selectedImage) {
                const imagePath = `catalogs/covers/${Date.now()}_${
                    selectedImage.name
                }`;
                imageUrl = await uploadFile(selectedImage, imagePath);
            }

            const filePath = `catalogs/${Date.now()}_${selectedFile.name}`;
            const fileUrl = await uploadFile(selectedFile, filePath);

            const catalogData = {
                name: formData.name, // Теперь это объект {ru, en, uz}
                imageUrl,
                fileUrl,
                fileName: selectedFile.name,
                fileType: selectedFile.type,
                fileSize: selectedFile.size,
            };

            await addCatalog(catalogData);
            toast({ title: "Успешно", description: "Каталог создан" });
            handleCloseDialog();
            fetchCatalogs();
        } catch (error) {
            toast({ title: "Ошибка", variant: "destructive" });
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
                            <div className="relative w-full h-48 bg-muted">
                                {catalog.imageUrl ? (
                                    <Image
                                        src={catalog.imageUrl}
                                        alt={getLocalizedName(catalog.name)}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText className="h-16 w-16 text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-lg line-clamp-1">
                                    {getLocalizedName(catalog.name, "ru")}
                                </h3>
                                <p className="text-xs text-muted-foreground mb-3 truncate">
                                    EN: {catalog.name.en} | UZ:{" "}
                                    {catalog.name.uz}
                                </p>

                                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                    <p>
                                        Размер:{" "}
                                        {formatFileSize(catalog.fileSize)}
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
                                        >
                                            <Download className="h-4 w-4 mr-2" />{" "}
                                            Скачать
                                        </a>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteClick(catalog)
                                        }
                                        className="text-destructive"
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
            {/* Dialog создания */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Добавить каталог</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Мультиязычное название */}
                        <MultilingualInput
                            label="Название каталога"
                            value={formData.name}
                            onChange={(name) =>
                                setFormData({ ...formData, name })
                            }
                            required
                        />

                        {/* Обложка */}
                        <div className="space-y-2">
                            <Label>Обложка (необязательно)</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={saving}
                            />
                            {imagePreview && (
                                <div className="relative w-full h-32 rounded border overflow-hidden">
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Файл */}
                        <div className="space-y-2">
                            <Label>Файл каталога (PDF)</Label>
                            <Input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                disabled={saving}
                            />
                            {selectedFile && (
                                <p className="text-sm text-blue-600 font-medium">
                                    {selectedFile.name}
                                </p>
                            )}
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
                            {catalogToDelete?.name.ru}&quot;? Это действие
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
