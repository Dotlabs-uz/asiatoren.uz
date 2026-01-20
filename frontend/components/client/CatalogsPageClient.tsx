"use client";

import { Catalog, Language, MediaSection } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface CatalogsPageClientProps {
    translations: { title: string };
    catalogues: Catalog[];
    heroMedia: MediaSection | null; // Добавили медиа
    locale: Language;
}

export default function CatalogsPageClient({
    translations,
    catalogues,
    heroMedia,
    locale,
}: CatalogsPageClientProps) {
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
                                alt={heroMedia.description || "Catalogs background"}
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
                                <source src={heroMedia.mediaUrl} type="video/mp4" />
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

            {/* Catalogs Grid */}
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-12 md:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {catalogues.map((catalogy) => (
                        <Link
                            key={catalogy.id}
                            href={catalogy.fileUrl}
                            target="_blank"
                            download
                            className="group"
                        >
                            <div className="border-2 border-cRed rounded-xl overflow-hidden hover:shadow-lg hover:shadow-cRed/20 transition-all duration-300 flex flex-col h-full">
                                {/* Image Container */}
                                <div className="relative aspect-3/4 bg-gray-50 overflow-hidden">
                                    <Image
                                        src={catalogy.imageUrl}
                                        alt={catalogy.name[locale]}
                                        fill
                                        loading="lazy"
                                        placeholder="blur"
                                        blurDataURL={catalogy.imageUrl}
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Title */}
                                <div className="p-4 bg-white">
                                    <p className="text-base md:text-lg font-bold text-gray-900 text-center group-hover:text-cRed transition-colors">
                                        {catalogy.name[locale]}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}