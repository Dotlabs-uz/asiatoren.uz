"use client";

import { useState } from "react";
import { Dealer, Language, MediaSection } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Globe, Map as MapIcon } from "lucide-react";

interface DealersPageClientProps {
    translations: {
        title: string;
    };
    data: Dealer[];
    heroMedia: MediaSection | null; // Добавили медиа
    locale: Language;
}

export default function DealersPageClient({
    translations,
    data,
    heroMedia,
    locale,
}: DealersPageClientProps) {
    const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(
        data.length > 0 ? data[0] : null
    );

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
                                alt={heroMedia.description || "Dealers background"}
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
                <h2 className="relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-bold text-center px-4 uppercase">
                    {translations.title}
                </h2>
            </div>

            {/* Dealers Content */}
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-12 md:py-16">
                {/* Сетка логотипов (стран/дилеров) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
                    {data.map((dealer) => (
                        <button
                            key={dealer.id}
                            onClick={() => setSelectedDealer(dealer)}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-300 gap-3 bg-white hover:shadow-md",
                                selectedDealer?.id === dealer.id
                                    ? "border-cRed ring-2 ring-cRed shadow-lg scale-105"
                                    : "border-gray-200 opacity-70 hover:opacity-100"
                            )}
                        >
                            <div className="relative w-12 h-12 md:w-16 md:h-16">
                                <Image
                                    src={dealer.logoUrl}
                                    alt={dealer.title[locale]}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-xs md:text-sm font-bold uppercase text-center line-clamp-2">
                                {dealer.title[locale]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Блок с адресами выбранного дилера */}
                {selectedDealer && (
                    <div className="w-full bg-linear-to-br from-gray-50 to-white border-l-4 border-cRed rounded-r-2xl p-6 md:p-10 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col gap-12">
                            {selectedDealer.addresses.map((address, idx) => (
                                <div key={idx} className="flex flex-col gap-6">
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                                        {address.title}
                                    </h3>

                                    <div className="flex flex-col gap-4 text-gray-700">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-cRed shrink-0 mt-1" />
                                            <span className="text-sm md:text-base leading-relaxed">
                                                {address.title}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-cRed shrink-0" />
                   <a                         
                                                href={`tel:${address.phoneNumbers.replace(/\s/g, "")}`}
                                                className="text-sm md:text-base font-medium hover:text-cRed transition-colors"
                                            >
                                                {address.phoneNumbers}
                                            </a>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Mail className="w-5 h-5 text-cRed shrink-0" />
                                            <a
                                                href={`mailto:${address.email}`}
                                                className="text-sm md:text-base hover:text-cRed transition-colors"
                                            >
                                                {address.email}
                                            </a>
                                        </div>

                                        {address.website && (
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-cRed shrink-0" />
                                                <a
                                                    href={address.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm md:text-base hover:text-cRed transition-colors"
                                                >
                                                    {address.website.replace(
                                                        /^https?:\/\//,
                                                        ""
                                                    )}
                                                </a>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 mt-2">
                                            <MapIcon className="w-5 h-5 text-cRed shrink-0" />
                                            <a
                                                href={address.map}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm md:text-base font-bold text-gray-900 hover:text-cRed flex items-center gap-1 transition-colors underline decoration-cRed underline-offset-4"
                                            >
                                                {locale === "ru"
                                                    ? "Мы на карте"
                                                    : locale === "uz"
                                                    ? "Xaritada biz"
                                                    : "On the map"}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Разделитель между филиалами, кроме последнего */}
                                    {idx < selectedDealer.addresses.length - 1 && (
                                        <div className="h-px bg-linear-to-r from-transparent via-gray-300 to-transparent w-full mt-4" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {data.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-2xl text-gray-400 mb-2">
                            Дилеров пока нет
                        </p>
                        <p className="text-gray-500">
                            Следите за обновлениями
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}