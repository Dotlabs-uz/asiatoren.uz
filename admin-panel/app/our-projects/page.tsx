"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import {
    getAllProjects,
    addProject,
    updateProject,
    deleteProject,
} from "@/lib/firebase/our-projects";
import { OurProjects, MultilingualText } from "@/types";
import ProjectForm from "@/components/admin/OurProjectsForm";

const getLocalizedText = (
    text: MultilingualText | string,
    lang: "ru" | "en" | "uz" = "ru"
): string => {
    if (typeof text === "string") return text;
    return text[lang] || text.ru || "";
};

export default function AdminOurProjectsPage() {
    const [projects, setProjects] = useState<OurProjects[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState<OurProjects | null>(
        null
    );
    const { toast } = useToast();

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await getAllProjects();
            setProjects(data);
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Не удалось загрузить проекты",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleFormSubmit = async (data: any) => {
        try {
            if (currentProject) {
                await updateProject(currentProject.id, data);
                toast({ title: "Успешно", description: "Проект обновлен" });
            } else {
                await addProject(data);
                toast({ title: "Успешно", description: "Проект создан" });
            }
            fetchProjects();
            setIsEditing(false);
        } catch (error) {
            toast({
                title: "Ошибка",
                description: "Ошибка при сохранении",
                variant: "destructive",
            });
        }
    };

    if (loading)
        return (
            <div className="p-8">
                <Skeleton className="h-8 w-48 mb-6" />
                <Skeleton className="h-[400px]" />
            </div>
        );

    if (isEditing) {
        return (
            <div className="p-4 md:p-8 max-w-5xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => setIsEditing(false)}
                    className="mb-4"
                >
                    ← Назад
                </Button>
                <h1 className="text-2xl font-bold mb-6">
                    {currentProject ? "Редактировать проект" : "Новый проект"}
                </h1>
                <ProjectForm
                    initialData={currentProject}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Наши проекты</h1>
                    <p className="text-muted-foreground">
                        Управление портфолио и контентом
                    </p>
                </div>
                <Button
                    onClick={() => {
                        setCurrentProject(null);
                        setIsEditing(true);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" /> Добавить проект
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div
                        key={project.id}
                        className="border rounded-xl overflow-hidden bg-card group relative"
                    >
                        <div className="aspect-video relative bg-muted">
                            <Image
                                src={project.previewImageUrl}
                                alt="preview"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">
                                {getLocalizedText(project.title, "ru")}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {getLocalizedText(
                                    project.content,
                                    "ru"
                                ).replace(/<[^>]*>/g, "")}
                            </p>
                        </div>
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                size="icon"
                                variant="secondary"
                                onClick={() => {
                                    setCurrentProject(project);
                                    setIsEditing(true);
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={async () => {
                                    if (confirm("Удалить проект?")) {
                                        await deleteProject(project.id);
                                        fetchProjects();
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
