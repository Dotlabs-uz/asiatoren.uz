"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { useToast } from "@/hooks/use-toast";
import {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    canDeleteCategory,
} from "@/lib/firebase/categories";
import { Category, MultilingualText } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { MultilingualInput } from "@/components/admin/MultilingualInput";

const emptyMultilingualText: MultilingualText = { ru: "", en: "", uz: "" };

const getLocalizedText = (
    text: MultilingualText | string,
    lang: "ru" | "en" | "uz" = "ru"
): string => {
    if (typeof text === "string") return text;
    return text[lang] || text.ru || text.en || text.uz || "";
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null
    );
    const [deleting, setDeleting] = useState(false);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState<MultilingualText>(
        emptyMultilingualText
    );

    useEffect(() => {
        fetchCategories();
    }, []);

    // Сброс формы при открытии/закрытии диалога
    useEffect(() => {
        if (isDialogOpen && editingCategory) {
            setFormData(editingCategory.title);
        } else if (isDialogOpen && !editingCategory) {
            setFormData(emptyMultilingualText);
        }
    }, [isDialogOpen, editingCategory]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить категории",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
        } else {
            setEditingCategory(null);
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingCategory(null);
        setFormData(emptyMultilingualText);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Валидация
        if (!formData.ru || !formData.en || !formData.uz) {
            toast({
                title: "Ошибка",
                description: "Заполните название на всех языках",
                variant: "destructive",
            });
            return;
        }

        try {
            setSaving(true);

            if (editingCategory) {
                // Редактирование
                await updateCategory(editingCategory.id, formData);
                toast({
                    title: "Успешно",
                    description: "Категория успешно обновлена",
                });
            } else {
                // Создание
                await addCategory(formData);
                toast({
                    title: "Успешно",
                    description: "Категория успешно создана",
                });
            }

            handleCloseDialog();
            fetchCategories();
        } catch (error) {
            console.error("Error saving category:", error);
            toast({
                title: "Ошибка",
                description: editingCategory
                    ? "Не удалось обновить категорию"
                    : "Не удалось создать категорию",
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return;

        try {
            setDeleting(true);

            // Проверяем, можно ли удалить категорию (используем ID вместо title)
            const canDelete = await canDeleteCategory(categoryToDelete.id);

            if (!canDelete) {
                toast({
                    title: "Ошибка",
                    description:
                        "Нельзя удалить категорию, у которой есть товары",
                    variant: "destructive",
                });
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
                return;
            }

            // Удаляем категорию
            await deleteCategory(categoryToDelete.id);

            toast({
                title: "Успешно",
                description: "Категория успешно удалена",
            });

            setDeleteDialogOpen(false);
            setCategoryToDelete(null);
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить категорию",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
        }
    };

    const formatDate = (date: Date) => {
        if (!date) return "—";
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
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
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead>Дата создания</TableHead>
                                <TableHead className="text-right">
                                    Действия
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[200px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[150px]" />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Skeleton className="h-8 w-8" />
                                            <Skeleton className="h-8 w-8" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Категории
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-2">
                        Управление категориями товаров
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    className="w-full md:w-auto"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить категорию
                </Button>
            </div>

            {categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Folder className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        Категорий пока нет
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        Начните с создания первой категории
                    </p>
                    <Button onClick={() => handleOpenDialog()}>
                        <Plus className="h-4 w-4 mr-2" />
                        Создать первую категорию
                    </Button>
                </div>
            ) : (
                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Название</TableHead>
                                <TableHead>Дата создания</TableHead>
                                <TableHead className="text-right">
                                    Действия
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">
                                        <div className="space-y-1">
                                            <div>
                                                🇷🇺{" "}
                                                {getLocalizedText(
                                                    category.title,
                                                    "ru"
                                                )}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                🇬🇧{" "}
                                                {getLocalizedText(
                                                    category.title,
                                                    "en"
                                                ) || "—"}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                🇺🇿{" "}
                                                {getLocalizedText(
                                                    category.title,
                                                    "uz"
                                                ) || "—"}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(category.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleOpenDialog(category)
                                                }
                                                aria-label="Редактировать категорию"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                <span className="sr-only">
                                                    Редактировать
                                                </span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDeleteClick(category)
                                                }
                                                aria-label="Удалить категорию"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                                <span className="sr-only">
                                                    Удалить
                                                </span>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Dialog для создания/редактирования */}
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
                            {editingCategory
                                ? "Редактировать категорию"
                                : "Добавить категорию"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory
                                ? "Обновите информацию о категории на всех языках"
                                : "Заполните название категории на всех языках"}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <MultilingualInput
                            label="Название категории"
                            value={formData}
                            onChange={setFormData}
                            required
                            placeholder={{
                                ru: "Введите название категории",
                                en: "Enter category name",
                                uz: "Kategoriya nomini kiriting",
                            }}
                        />
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

            {/* Dialog подтверждения удаления */}
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
                            Вы уверены, что хотите удалить категорию &quot;
                            {categoryToDelete
                                ? getLocalizedText(categoryToDelete.title, "ru")
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
