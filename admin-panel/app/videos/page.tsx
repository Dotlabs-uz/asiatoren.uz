"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    getAllVideos,
    addVideo,
    updateVideo,
    deleteVideo,
} from "@/lib/firebase/videos";
import { Video } from "@/types";
import VideoForm from "@/components/admin/VideosForm";

export default function AdminVideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState<Video | null>(null);

    const load = async () => setVideos(await getAllVideos());
    useEffect(() => {
        load();
    }, []);

    const handleFormSubmit = async (data: any) => {
        if (current) await updateVideo(current.id, data);
        else await addVideo(data);
        setIsEditing(false);
        load();
    };

    if (isEditing)
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">
                    {current ? "Редактировать видео" : "Добавить видео"}
                </h1>
                <VideoForm
                    initialData={current}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Видеогалерея</h1>
                <Button
                    onClick={() => {
                        setCurrent(null);
                        setIsEditing(true);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" /> Добавить видео
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                    <div
                        key={video.id}
                        className="border rounded-xl bg-white overflow-hidden shadow-sm flex flex-col"
                    >
                        <div className="aspect-video bg-black flex items-center justify-center text-white">
                            <VideoIcon className="h-12 w-12 opacity-20" />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold mb-2 line-clamp-1">
                                {video.title.ru}
                            </h3>
                            <a
                                href={video.videoUrl}
                                target="_blank"
                                className="text-sm text-blue-600 flex items-center gap-1 hover:underline mb-4"
                            >
                                <ExternalLink className="h-3 w-3" /> Смотреть
                                видео
                            </a>
                            <div className="flex justify-end gap-2 mt-auto">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setCurrent(video);
                                        setIsEditing(true);
                                    }}
                                >
                                    <Pencil className="h-4 w-4 mr-1" /> Ред.
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                        if (confirm("Удалить видео?")) {
                                            await deleteVideo(video.id);
                                            load();
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
