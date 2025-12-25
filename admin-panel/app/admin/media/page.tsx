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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
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
import { Media } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

const mediaSchema = z.object({
    title: z.string().min(2, "Название должно содержать минимум 2 символа"),
    type: z.enum(["certificate", "partner"]),
    imageFile: z.any().optional(),
});
type MediaFormValues = z.infer<typeof mediaSchema>;

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

    const form = useForm<MediaFormValues>({
        resolver: zodResolver(mediaSchema),
        defaultValues: {
            title: "",
            type: "certificate",
        },
    });

    useEffect(() => {
        fetchMedia();
    }, []);

    useEffect(() => {
        if (isDialogOpen && editingMedia) {
            form.reset({
                title: editingMedia.title,
                type: editingMedia.type,
            });
            setImagePreview(editingMedia.imageUrl);
        } else if (isDialogOpen && !editingMedia) {
            form.reset({
                title: "",
                type: "certificate",
            });
            setImagePreview(null);
        }
    }, [isDialogOpen, editingMedia, form]);

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
        form.reset();
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

    const onSubmit = async (data: MediaFormValues) => {
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
                const path = `media/${data.type}/${fileName}`;

                await uploadFile(file, path);
                imageUrl = await getFileURL(path);
            }

            if (editingMedia) {
                // Редактирование
                await updateMedia(editingMedia.id, {
                    title: data.title,
                    type: data.type,
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
                    title: data.title,
                    type: data.type,
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

    const formatDate = (date: Date) => {
        if (!date) return "—";
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
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
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                                />
                            </div>
                            <div className="p-3">
                                <p className="font-medium text-sm truncate">
                                    {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
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
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingMedia
                                ? "Редактировать медиа"
                                : "Добавить медиа"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMedia
                                ? "Обновите информацию о медиа"
                                : "Загрузите изображение и укажите тип"}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Название</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Название сертификата или партнёра"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }: { field: any }) => (
                                    <FormItem>
                                        <FormLabel>Тип</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Выберите тип" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="certificate">
                                                    Сертификат
                                                </SelectItem>
                                                <SelectItem value="partner">
                                                    Партнёр
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <Label htmlFor="image-upload">
                                    Изображение
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
                    </Form>
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
                            {mediaToDelete?.title}&quot;? Это действие нельзя
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
