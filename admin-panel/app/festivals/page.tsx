"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    getAllFestivals,
    addFestival,
    updateFestival,
    deleteFestival,
} from "@/lib/firebase/festivals";
import { Festival, FestivalFormData } from "@/types";
import FestivalForm from "@/components/admin/FestivalsForm";
import Image from "next/image";

export default function AdminFestivalsPage() {
    const [festivals, setFestivals] = useState<Festival[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState<Festival | null>(null);
    const { toast } = useToast();

    const fetchFestivals = async () => {
        const data = await getAllFestivals();
        setFestivals(data);
    };

    useEffect(() => {
        fetchFestivals();
    }, []);

    const handleFormSubmit = async (data: FestivalFormData) => {
        if (current) await updateFestival(current.id, data);
        else await addFestival(data);
        toast({ title: "Успешно сохранено" });
        setIsEditing(false);
        fetchFestivals();
    };

    if (isEditing)
        return (
            <div className="p-8 max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    {current ? "Редактировать" : "Новый фестиваль"}
                </h1>
                <FestivalForm
                    initialData={current}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Фестивали</h1>
                <Button
                    onClick={() => {
                        setCurrent(null);
                        setIsEditing(true);
                    }}
                >
                    <Plus className="mr-2" /> Добавить
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {festivals.map((festival) => (
                    <div
                        key={festival.id}
                        className="border rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="aspect-video relative bg-muted">
                            <Image
                                src={festival.previewImageUrl}
                                alt="f"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-4">
                                {festival.title.ru}
                            </h3>
                            <div className="flex justify-between">
                                <span className="text-xs text-muted-foreground flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {festival.createdAt.toLocaleDateString()}
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-blue-600"
                                        onClick={() => {
                                            setCurrent(festival);
                                            setIsEditing(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-red-600"
                                        onClick={async () => {
                                            if (confirm("Удалить?")) {
                                                await deleteFestival(
                                                    festival.id
                                                );
                                                fetchFestivals();
                                            }
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
