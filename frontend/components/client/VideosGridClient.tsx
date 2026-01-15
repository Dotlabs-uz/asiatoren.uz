"use client";

import { Video, Language } from "@/types";
import Image from "next/image";
import { Play } from "lucide-react";

interface VideoGridClientProps {
    videos: Video[];
    locale: Language;
}

export default function VideoGridClient({
    videos,
    locale,
}: VideoGridClientProps) {
    // Функция извлечения ID для превью YouTube
    const getYoutubeId = (url: string) => {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {videos.map((video) => {
                const videoId = getYoutubeId(video.videoUrl);
                const thumbnail = videoId
                    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                    : null;

                return (
                    <a
                        key={video.id}
                        href={video.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                        {/* Контейнер превью */}
                        <div className="relative aspect-video w-full overflow-hidden">
                            {thumbnail ? (
                                <Image
                                    src={thumbnail}
                                    alt={video.title[locale]}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                    <Play className="text-white/20 w-12 h-12" />
                                </div>
                            )}

                            {/* Кнопка Play по центру */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/40 transition-colors duration-300">
                                <div className="w-14 h-14 bg-cRed rounded-full flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:scale-110">
                                    <Play
                                        fill="currentColor"
                                        className="ml-1 w-6 h-6"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Информационная часть под видео */}
                        <div className="p-5 flex flex-col gap-2">
                            <h3 className="font-bold text-lg md:text-xl line-clamp-2 leading-tight group-hover:text-cRed transition-colors">
                                {video.title[locale]}
                            </h3>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider">
                                {new Date(video.createdAt).toLocaleDateString(
                                    locale === "ru" ? "ru-RU" : "en-US"
                                )}
                            </p>
                        </div>
                    </a>
                );
            })}
        </div>
    );
}
