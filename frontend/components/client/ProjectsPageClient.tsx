"use client";

import { Language, OurProjects } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ProjectsPageClientProps {
    translations: { title: string; btn: string };
    projects: OurProjects[];
    locale: Language;
}

export default function ProjectsPageClient({
    translations,
    projects,
    locale,
}: ProjectsPageClientProps) {
    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <div className="w-full bg-cRed/60 h-20" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-center px-4">
                {translations.title}
            </h2>
            <div className="max-w-[1400px] flex flex-col justify-center items-center gap-10 my-10 mx-5 w-full">
                {projects.map((item, idx) => (
                    <div
                        key={item.id}
                        className={cn(
                            "w-full flex flex-col md:flex-row justify-center items-center gap-8",
                            idx % 2 !== 0
                                ? "md:flex-row-reverse"
                                : "md:flex-row"
                        )}
                    >
                        <div className="w-full md:w-1/2">
                            <Image
                                src={item.previewImageUrl}
                                alt={item.title[locale]}
                                width={800}
                                height={500}
                                className="object-cover w-full h-64 md:h-80 rounded-xl shadow-lg"
                            />
                        </div>
                        <div className="w-full md:w-1/2 flex flex-col gap-4 px-4">
                            <h4 className="text-2xl md:text-3xl font-bold text-cRed">
                                {item.title[locale]}
                            </h4>
                            <div
                                className="text-muted-foreground line-clamp-3"
                                dangerouslySetInnerHTML={{
                                    __html: item.content[locale],
                                }}
                            />
                            <Link href={`/projects/${item.id}`}>
                                <Button className="w-44 py-6 text-lg">
                                    {translations.btn}
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
