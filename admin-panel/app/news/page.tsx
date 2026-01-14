"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
    getAllNews,
    addNews,
    updateNews,
    deleteNews,
} from "@/lib/firebase/news";
import { News, NewsFormData } from "@/types";
import NewsForm from "@/components/admin/NewsForm";
import Image from "next/image";

export default function AdminNewsPage() {
    const [news, setNews] = useState<News[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState<News | null>(null);
    const { toast } = useToast();

    const fetchNews = async () => {
        const data = await getAllNews();
        setNews(data);
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleFormSubmit = async (data: NewsFormData) => {
        if (current) await updateNews(current.id, data);
        else await addNews(data);
        toast({ title: "Успешно" });
        setIsEditing(false);
        fetchNews();
    };

    if (isEditing)
        return (
            <div className="p-8 max-w-5xl mx-auto">
                <NewsForm
                    initialData={current}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );

    return (
        <div className="p-8">
            <div className="flex justify-between mb-8">
                <h1 className="text-3xl font-bold">Новости</h1>
                <Button
                    onClick={() => {
                        setCurrent(null);
                        setIsEditing(true);
                    }}
                >
                    <Plus className="mr-2" /> Добавить новость
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {news.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-xl overflow-hidden group relative bg-white"
                    >
                        <div className="aspect-video relative">
                            <Image
                                src={item.previewImageUrl}
                                alt="n"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold truncate">
                                {item.title.ru}
                            </h3>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    onClick={() => {
                                        setCurrent(item);
                                        setIsEditing(true);
                                    }}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={async () => {
                                        if (confirm("Удалить?")) {
                                            await deleteNews(item.id);
                                            fetchNews();
                                        }
                                    }}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
