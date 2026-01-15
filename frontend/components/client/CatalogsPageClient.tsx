"use client";

import { Catalog, Language } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface CatalogsPageClientProps {
    translations: { title: string };
    catalogues: Catalog[];
    locale: Language;
}

export default function CatalogsPageClient({
    translations,
    catalogues,
    locale,
}: CatalogsPageClientProps) {
    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <div className="w-full bg-cRed/60 h-20" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center px-4">
                {translations.title}
            </h2>
            <div className="max-w-[1400px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 my-10 mx-5">
                {catalogues.map((catalogy) => (
                    <Link
                        key={catalogy.id}
                        href={catalogy.fileUrl}
                        target="_blank"
                        download
                    >
                        <div className="border-2 border-cRed rounded-md flex flex-col justify-center items-center gap-3 p-2">
                            <Image
                                src={catalogy.imageUrl}
                                alt={catalogy.name[locale]}
                                width={500}
                                height={500}
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL={catalogy.imageUrl}
                                className="object-contain rounded-md"
                            />
                            <p className="text-base md:text-lg lg:text-xl font-bold">
                                {catalogy.name[locale]}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
