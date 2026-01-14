"use client";

import { useState } from "react";
import { VideoFormData } from "@/types";
import { MultilingualInput } from "@/components/admin/MultilingualInput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Video as VideoIcon } from "lucide-react";

export default function VideoForm({ initialData, onSubmit, onCancel }: any) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<VideoFormData>({
        title: initialData?.title || { ru: "", en: "", uz: "" },
        videoUrl: initialData?.videoUrl || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-6 rounded-xl border"
        >
            <MultilingualInput
                label="Заголовок видео"
                value={formData.title}
                onChange={(title) => setFormData({ ...formData, title })}
                required
            />

            <div className="space-y-2">
                <Label htmlFor="videoUrl">
                    Ссылка на видео (YouTube / Vimeo)
                </Label>
                <div className="relative">
                    <VideoIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="videoUrl"
                        className="pl-10"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={formData.videoUrl}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                videoUrl: e.target.value,
                            })
                        }
                        required
                        type="url"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    Вставьте полную ссылку из адресной строки браузера.
                </p>
            </div>

            <div className="flex justify-end gap-4 border-t pt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Отмена
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : null}
                    Сохранить видео
                </Button>
            </div>
        </form>
    );
}
