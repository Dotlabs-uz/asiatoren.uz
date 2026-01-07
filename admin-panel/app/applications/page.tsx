"use client";

import { useEffect, useState } from "react";
import { Trash2, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Application } from "@/types";
import {
    getApplications,
    updateApplicationStatus,
    deleteApplication,
} from "@/lib/firebase/applications";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [applicationToDelete, setApplicationToDelete] = useState<
        string | null
    >(null);
    const [viewingApplication, setViewingApplication] =
        useState<Application | null>(null);
    const [deleting, setDeleting] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const data = await getApplications();
            setApplications(data);
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить заявки",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (
        id: string,
        newStatus: Application["status"]
    ) => {
        try {
            await updateApplicationStatus(id, newStatus);

            // Обновляем локально
            setApplications((prev) =>
                prev.map((app) =>
                    app.id === id ? { ...app, status: newStatus } : app
                )
            );

            toast({
                title: "Успешно",
                description: "Статус заявки обновлен",
            });
        } catch (error) {
            console.error("Error updating status:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось обновить статус",
                variant: "destructive",
            });
        }
    };

    const handleDeleteClick = (id: string) => {
        setApplicationToDelete(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!applicationToDelete) return;

        try {
            setDeleting(true);
            await deleteApplication(applicationToDelete);

            setApplications((prev) =>
                prev.filter((app) => app.id !== applicationToDelete)
            );

            toast({
                title: "Успешно",
                description: "Заявка успешно удалена",
            });

            setDeleteDialogOpen(false);
            setApplicationToDelete(null);
        } catch (error) {
            console.error("Error deleting application:", error);
            toast({
                title: "Ошибка",
                description: "Не удалось удалить заявку",
                variant: "destructive",
            });
        } finally {
            setDeleting(false);
        }
    };

    const handleView = (application: Application) => {
        setViewingApplication(application);
        setViewDialogOpen(true);
    };

    const formatDate = (date: Date) => {
        if (!date) return "—";
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (status: Application["status"]) => {
        switch (status) {
            case "new":
                return (
                    <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Новая
                    </Badge>
                );
            case "processing":
                return (
                    <Badge
                        variant="outline"
                        className="bg-yellow-50 text-yellow-700 border-yellow-200"
                    >
                        <Clock className="w-3 h-3 mr-1" />В обработке
                    </Badge>
                );
            case "completed":
                return (
                    <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                    >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Завершена
                    </Badge>
                );
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
                </div>
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Имя</TableHead>
                                <TableHead>Контакты</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead>Дата</TableHead>
                                <TableHead className="text-right">
                                    Действия
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[150px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[200px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-6 w-[100px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-4 w-[150px]" />
                                    </TableCell>
                                    <TableCell>
                                        <Skeleton className="h-8 w-[100px] ml-auto" />
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
                        Заявки
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground mt-2">
                        Управление заявками от клиентов
                    </p>
                </div>
                <div className="text-sm text-muted-foreground">
                    Всего заявок:{" "}
                    <span className="font-semibold">{applications.length}</span>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                        Заявок пока нет
                    </h3>
                    <p className="text-muted-foreground">
                        Новые заявки будут отображаться здесь
                    </p>
                </div>
            ) : (
                <div className="border rounded-lg overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Имя и Фамилия</TableHead>
                                <TableHead>Контакты</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead>Дата создания</TableHead>
                                <TableHead className="text-right">
                                    Действия
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((application) => (
                                <TableRow key={application.id}>
                                    <TableCell className="font-medium">
                                        {application.name} {application.surname}
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="text-sm">
                                                {application.phoneNumber}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {application.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={application.status}
                                            onValueChange={(value) =>
                                                handleStatusChange(
                                                    application.id,
                                                    value as Application["status"]
                                                )
                                            }
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="new">
                                                    Новая
                                                </SelectItem>
                                                <SelectItem value="processing">
                                                    В обработке
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Завершена
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(application.createdAt)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleView(application)
                                                }
                                                aria-label="Просмотреть заявку"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        application.id
                                                    )
                                                }
                                                aria-label="Удалить заявку"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            {/* Dialog просмотра заявки */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Детали заявки</DialogTitle>
                        <DialogDescription>
                            Информация о заявке от{" "}
                            {viewingApplication &&
                                `${viewingApplication.name} ${viewingApplication.surname}`}
                        </DialogDescription>
                    </DialogHeader>
                    {viewingApplication && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Имя
                                    </p>
                                    <p className="text-base">
                                        {viewingApplication.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Фамилия
                                    </p>
                                    <p className="text-base">
                                        {viewingApplication.surname}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Телефон
                                    </p>
                                    <p className="text-base">
                                        {viewingApplication.phoneNumber}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Email
                                    </p>
                                    <p className="text-base">
                                        {viewingApplication.email}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-1">
                                    Статус
                                </p>
                                {getStatusBadge(viewingApplication.status)}
                            </div>

                            {viewingApplication.text && (
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Сообщение
                                    </p>
                                    <p className="text-base mt-1 p-3 bg-muted rounded-md">
                                        {viewingApplication.text}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Дата создания
                                </p>
                                <p className="text-base">
                                    {formatDate(viewingApplication.createdAt)}
                                </p>
                            </div>
                        </div>
                    )}
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
                            Вы уверены, что хотите удалить эту заявку? Это
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
