"use client";

import { Video, Language } from "@/types";
import Image from "next/image";
import { Play } from "lucide-react";

interface VideoCarouselProps {
    videos: Video[];
    locale: Language;
}

export default function VideoCarousel({ videos, locale }: VideoCarouselProps) {
    const getYoutubeId = (url: string) => {
        const regExp =
            /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    return (
        <div className="w-full">
            <div className="overflow-x-auto pb-4 -mx-5 sm:-mx-8 lg:-mx-16 scrollbar-hide">
                <div className="flex gap-4 lg:gap-6 px-5 sm:px-8 lg:px-16">
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
                                className="group relative w-[280px] md:w-[350px] aspect-video bg-gray-200 rounded-2xl overflow-hidden shrink-0 shadow-sm hover:shadow-md transition-all"
                            >
                                {/* Превью видео */}
                                {thumbnail ? (
                                    <Image
                                        src={thumbnail}
                                        alt={video.title[locale]}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                                        <Play className="text-white opacity-20 w-12 h-12" />
                                    </div>
                                )}

                                {/* Оверлей с иконкой Play */}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-cRed rounded-full flex items-center justify-center text-white shadow-xl transform transition-transform group-hover:scale-110">
                                        <Play
                                            fill="currentColor"
                                            className="ml-1 w-6 h-6 md:w-8 md:h-8"
                                        />
                                    </div>
                                </div>

                                {/* Заголовок снизу */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                                    <p className="text-white text-sm md:text-base font-bold line-clamp-1">
                                        {video.title[locale]}
                                    </p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
