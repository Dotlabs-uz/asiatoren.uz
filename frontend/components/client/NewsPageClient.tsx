"use client";

import { Language, News, MediaSection } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface NewsPageClientProps {
    translations: { title: string; btn: string };
    news: News[];
    heroMedia: MediaSection | null; // Добавили медиа
    locale: Language;
}

export default function NewsPageClient({
    translations,
    news,
    heroMedia,
    locale,
}: NewsPageClientProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Dynamic Media */}
            <div className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
                {/* Динамическое медиа (изображение или видео) */}
                {heroMedia ? (
                    <>
                        {heroMedia.mediaType === "image" ? (
                            <Image
                                src={heroMedia.mediaUrl}
                                alt={heroMedia.description || "News background"}
                                fill
                                className="object-cover"
                                priority
                                quality={90}
                            />
                        ) : (
                            <video
                                src={heroMedia.mediaUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                poster={heroMedia.thumbnailUrl}
                                className="absolute inset-0 w-full h-full object-cover"
                            >
                                <source
                                    src={heroMedia.mediaUrl}
                                    type="video/mp4"
                                />
                            </video>
                        )}
                    </>
                ) : (
                    // Фолбэк: серый фон если медиа не загружено
                    <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200" />
                )}

                {/* Темный оверлей */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Заголовок */}
                <h2 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-bold text-center px-4">
                    {translations.title}
                </h2>
            </div>

            {/* News List */}
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-12 md:py-20">
                <div className="flex flex-col gap-16 md:gap-20">
                    {news.map((item, idx) => (
                        <div
                            key={item.id}
                            className={cn(
                                "w-full flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12",
                                idx % 2 !== 0
                                    ? "md:flex-row-reverse"
                                    : "md:flex-row",
                            )}
                        >
                            {/* Image */}
                            <div className="w-full md:w-1/2 group">
                                <div className="relative aspect-video overflow-hidden rounded-2xl shadow-xl">
                                    <Image
                                        src={item.previewImageUrl}
                                        alt={item.title[locale]}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="w-full md:w-1/2 flex flex-col gap-5">
                                <h4 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 hover:text-cRed transition-colors">
                                    {item.title[locale]}
                                </h4>
                                <div
                                    className="text-gray-600 text-base md:text-lg line-clamp-4 leading-relaxed"
                                    dangerouslySetInnerHTML={{
                                        __html: item.content[locale],
                                    }}
                                />
                                <Link
                                    href={`/news/${item.id}`}
                                    className="mt-2"
                                >
                                    <Button className="w-44 py-6 text-base md:text-lg bg-cRed hover:bg-cRed/90 rounded-xl">
                                        {translations.btn}
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {news.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-2xl text-gray-400 mb-2">
                            Новостей пока нет
                        </p>
                        <p className="text-gray-500">Следите за обновлениями</p>
                    </div>
                )}
            </div>
        </div>
    );
}
