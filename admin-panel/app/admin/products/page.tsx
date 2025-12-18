"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, ImageIcon, Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { getItems, deleteItem } from "@/lib/firebase/db";
import { deleteFile } from "@/lib/firebase/storage";
import { Product } from "@/types";
import { ProductsTableSkeleton } from "@/components/admin/ProductsTableSkeleton";
import { getCategories } from "@/lib/firebase/categories";
import { Category } from "@/types";
import { getProducts } from "@/lib/firebase/products";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(
        null
    );
    const [deleting, setDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { toast } = useToast();

    // Фильтрация и пагинация
    const filteredProducts = useMemo(() => {
        if (!searchQuery) return products;

        const query = searchQuery.toLowerCase();
        return products.filter(
            (product) =>
                product.title.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.categoryId.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredProducts.slice(start, end);
    }, [filteredProducts, currentPage]);

    // Сброс страницы при изменении поиска
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Загружаем товары и категории параллельно
                const [productsData, categoriesData] = await Promise.all([
                    getProducts(),
                    getCategories(),
                ]);

                setProducts(productsData);
                setCategories(categoriesData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast({
                    title: "Ошибка",
                    description: "Не удалось загрузить данные",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getCategoryName = (categoryId: string) => {
        const category = categories.find((c) => c.id === categoryId);
        return category?.title || "Без категории";
    };

    const handleDeleteClick = (product: Product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const extractStoragePath = (url: string): string | null => {
        try {
            // Извлекаем путь из Firebase Storage URL
            // Формат: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?alt=media
            const urlObj = new URL(url);
            if (urlObj.hostname.includes("firebasestorage.googleapis.com")) {
                const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/)?.[1];
                if (pathMatch) {
                    return decodeURIComponent(pathMatch);
                }
            }
            // Если это обычный путь, возвращаем как есть
            return url;
        } catch {
            return null;
        }
    };

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return;

        try {
            setDeleting(true);

            // Удаляем изображения из Storage
            if (productToDelete.images && productToDelete.images.length > 0) {
                const deletePromises = productToDelete.images.map(
                    (imageUrl) => {
                        const path = extractStoragePath(imageUrl);
                        if (path) {
                            return deleteFile(path).catch((error) => {
                                console.error(
                                    `Error deleting image ${path}:`,
                                    error
                                );
                                // Продолжаем даже если удаление изображения не удалось
                            });
                        }
                        return Promise.resolve();
                    }
                );
                await Promise.all(deletePromises);
            }

            // Удаляем товар из Firestore
            await deleteItem("products", productToDelete.id);

            // Обновляем список
            setProducts(products.filter((p) => p.id !== productToDelete.id));

            toast({
                title: "Успешно",
                description: "Товар успешно удален",
            });

            setDeleteDialogOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error("Error deleting product:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить товар",
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
                        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="h-10 w-32 bg-muted rounded animate-pulse" />
                </div>
                <ProductsTableSkeleton />
            </div>
        );
    }

    console.log({ products });

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Товары
                    </h1>
                    <p className="text-muted-foreground mt-2 text-sm md:text-base">
                        Управление каталогом товаров
                    </p>
                </div>
                <Button asChild className="w-full md:w-auto">
                    <Link href="/admin/products/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить товар
                    </Link>
                </Button>
            </div>

            {/* Поиск */}
            <div className="mb-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Поиск по названию, описанию или категории..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                {searchQuery && (
                    <p className="text-sm text-muted-foreground mt-2">
                        Найдено: {filteredProducts.length} товаров
                    </p>
                )}
            </div>

            {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        {searchQuery ? "Товары не найдены" : "Товаров пока нет"}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                        {searchQuery
                            ? "Попробуйте изменить запрос поиска"
                            : "Начните с добавления первого товара в каталог"}
                    </p>
                    {!searchQuery && (
                        <Button asChild>
                            <Link href="/admin/products/new">
                                <Plus className="h-4 w-4 mr-2" />
                                Добавить товар
                            </Link>
                        </Button>
                    )}
                </div>
            ) : (
                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Изображение
                                </TableHead>
                                <TableHead>Название</TableHead>
                                <TableHead className="hidden sm:table-cell">
                                    Цена
                                </TableHead>
                                <TableHead className="hidden md:table-cell">
                                    Категория
                                </TableHead>
                                <TableHead className="text-right">
                                    Действия
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        {product.images &&
                                        product.images.length > 0 ? (
                                            <div className="relative w-16 h-16 rounded-md overflow-hidden border">
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-md border flex items-center justify-center bg-muted">
                                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {product.title}
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {product.price
                                            ? `${product.price.toLocaleString(
                                                  "uz-Uz"
                                              )} sum`
                                            : "—"}
                                    </TableCell>
                                    <TableCell>
                                        {getCategoryName(product.categoryId)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                asChild
                                                aria-label="Редактировать товар"
                                            >
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">
                                                        Редактировать
                                                    </span>
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDeleteClick(product)
                                                }
                                                aria-label="Удалить товар"
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

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        Страница {currentPage} из {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                        >
                            Назад
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            Вперед
                        </Button>
                    </div>
                </div>
            )}

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
                            Вы уверены, что хотите удалить товар &quot;
                            {productToDelete?.title}&quot;? Это действие нельзя
                            отменить. Все изображения товара также будут
                            удалены.
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
