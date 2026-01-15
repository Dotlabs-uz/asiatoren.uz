import { Language, OurProjects } from "@/types";
import { Calendar, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

interface ProjectPageClientProps {
    project: OurProjects;
    locale: Language;
}

export default function ProjectPageClient({
    project,
    locale,
}: ProjectPageClientProps) {
    return (
        <div className="flex flex-col items-center">
            {/* Декоративная шапка */}
            <div className="w-full bg-cRed/60 h-20" />

            <div className="max-w-[1000px] w-full px-5 py-10">
                {/* Кнопка назад */}
                <Link href="/news" className="mb-6 inline-block">
                    <Button variant="ghost" className="gap-2">
                        <ChevronLeft className="h-4 w-4" />
                        Назад к новостям
                    </Button>
                </Link>

                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-left leading-tight">
                    {project.title[locale]}
                </h1>

                <div className="flex items-center gap-2 text-muted-foreground mb-8">
                    <Calendar className="h-4 w-4" />
                    <span>
                        {new Date(project.createdAt).toLocaleDateString(
                            locale === "uz"
                                ? "uz-UZ"
                                : locale === "en"
                                ? "en-US"
                                : "ru-RU"
                        )}
                    </span>
                </div>

                {/* Главное изображение */}
                <div className="relative w-full aspect-video mb-10 overflow-hidden rounded-2xl shadow-xl">
                    <Image
                        src={project.previewImageUrl}
                        alt={project.title[locale]}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Основной контент */}
                <div
                    className="prose prose-lg max-w-none dark:prose-invert 
                               prose-p:font-medium prose-p:leading-relaxed 
                               prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{
                        __html: project.content[locale],
                    }}
                />

                {project.images && project.images.length > 0 && (
                    <div className="mt-16 pt-10 border-t">
                        <h3 className="text-2xl font-bold mb-8 uppercase tracking-wide">
                            Фотографии
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {project.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className="relative aspect-4/3 rounded-xl overflow-hidden shadow-md"
                                >
                                    <Image
                                        src={img}
                                        alt={`Gallery-${idx}`}
                                        fill
                                        className="object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
