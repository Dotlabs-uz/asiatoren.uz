"use client";

import { useState } from "react";
import { Dealer, Language } from "@/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MapPin, Phone, Mail, Globe, Map as MapIcon } from "lucide-react";

interface DealersPageClientProps {
    translations: {
        title: string;
    };
    data: Dealer[];
    locale: Language;
}

export default function DealersPageClient({
    translations,
    data,
    locale,
}: DealersPageClientProps) {
    const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(
        data.length > 0 ? data[0] : null
    );

    return (
        <div className="flex flex-col items-center gap-10 pb-20">
            <div className="w-full bg-cRed/60 h-20" />

            <h2 className="text-4xl md:text-6xl font-bold text-center px-4 uppercase">
                {translations.title}
            </h2>

            <div className="max-w-[1400px] w-full px-5">
                {/* Сетка логотипов (стран/дилеров) */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
                    {data.map((dealer) => (
                        <button
                            key={dealer.id}
                            onClick={() => setSelectedDealer(dealer)}
                            className={cn(
                                "flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-300 gap-3 bg-white hover:shadow-md",
                                selectedDealer?.id === dealer.id
                                    ? "border-cRed ring-1 ring-cRed shadow-lg"
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
                            <span className="text-xs md:text-sm font-bold uppercase text-center">
                                {dealer.title[locale]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Блок с адресами выбранного дилера */}
                {selectedDealer && (
                    <div className="w-full bg-[#fcfcfc] border-l-4 border-cRed rounded-r-2xl p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col gap-12">
                            {selectedDealer.addresses.map((address, idx) => (
                                <div key={idx} className="flex flex-col gap-6">
                                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                                        {address.title}
                                    </h3>

                                    <div className="flex flex-col gap-4 text-gray-600">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-cRed shrink-0 mt-1" />
                                            <span className="text-sm md:text-base leading-relaxed">
                                                {address.title}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Phone className="w-5 h-5 text-cRed shrink-0" />
                                            <span className="text-sm md:text-base font-medium">
                                                {address.phoneNumbers}
                                            </span>
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
                                                className="text-sm md:text-base font-bold text-gray-800 hover:text-cRed flex items-center gap-1 transition-colors underline decoration-cRed underline-offset-4"
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
                                    {idx <
                                        selectedDealer.addresses.length - 1 && (
                                        <div className="h-px bg-gray-200 w-full mt-4" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
