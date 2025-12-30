"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroClientProps {
    translations: {
        title: string;
        p: string;
        btn1: string;
        btn2: string;
    };
}

export const HeroClient = ({ translations }: HeroClientProps) => {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const paragraphRef = useRef<HTMLParagraphElement>(null);
    const button1Ref = useRef<HTMLDivElement>(null);
    const button2Ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
            });

            // Заголовок
            tl.from(titleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out",
            });

            // Параграф
            tl.from(
                paragraphRef.current,
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                },
                "-=0.6"
            );

            // Первая кнопка
            tl.from(
                button1Ref.current,
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                },
                "-=0.4"
            );

            // Вторая кнопка
            tl.from(
                button2Ref.current,
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                },
                "-=0.45" // Небольшое перекрытие
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="w-full lg:w-[40%] md:w-[60%] h-screen flex flex-col justify-end items-start gap-12 md:gap-16 lg:gap-28 px-5 sm:px-8 md:mx-10 pb-8 md:pb-12">
            <h1
                ref={titleRef}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold"
            >
                {translations.title}
            </h1>
            <div className="flex flex-col justify-start items-start gap-4 md:gap-6 lg:gap-8">
                <p
                    ref={paragraphRef}
                    className="text-base sm:text-lg md:text-xl text-white font-medium max-w-2xl"
                >
                    {translations.p}
                </p>
                <div className="flex flex-col sm:flex-row justify-start items-stretch sm:items-start gap-3 w-full sm:w-auto">
                    <div ref={button1Ref}>
                        <Link href="/contacts" className="w-full">
                            <Button
                                className="w-full sm:w-52 md:w-60 px-6 sm:px-8 md:px-10 py-4 md:py-5 text-sm md:text-base cursor-pointer"
                                variant={"custom"}
                            >
                                {translations.btn1}
                            </Button>
                        </Link>
                    </div>
                    <div ref={button2Ref}>
                        <Link
                            href="/files/catalog.pdf"
                            download={"Asia-Taren-Catalog.pdf"}
                        >
                            <Button className="w-full sm:w-52 md:w-60 px-6 sm:px-8 md:px-10 py-4 md:py-5 text-sm md:text-base bg-transparent hover:bg-white/10 border border-white cursor-pointer">
                                {translations.btn2}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
