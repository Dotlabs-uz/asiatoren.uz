"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface HeroClientProps {
    translations: {
        title: string;
        p: string;
        btn1: string;
        btn2: string;
    };
}

export const HeroClient = ({ translations }: HeroClientProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Начальная анимация
            const tl = gsap.timeline({
                defaults: { ease: "power3.out" },
            });

            tl.from(".hero-title", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out",
            });

            tl.from(
                ".hero-paragraph",
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                },
                "-=0.6"
            );

            tl.from(
                ".hero-button",
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.15,
                },
                "-=0.4"
            );

            // Параллакс с fade out
            gsap.to(contentRef.current, {
                y: -150,
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1,
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full lg:w-[40%] md:w-[60%] h-screen flex flex-col justify-end items-start px-5 sm:px-8 md:mx-10 pb-8 md:pb-12"
        >
            <div
                ref={contentRef}
                className="flex flex-col gap-12 md:gap-16 lg:gap-28 mb-20"
            >
                <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white font-bold">
                    {translations.title}
                </h1>
                <div className="flex flex-col justify-start items-start gap-4 md:gap-6 lg:gap-8">
                    <p className="hero-paragraph text-base sm:text-lg md:text-xl text-white font-medium max-w-2xl">
                        {translations.p}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-start items-stretch sm:items-start gap-3 w-full sm:w-auto">
                        <div className="hero-button">
                            <Link href="/contacts" className="w-full">
                                <Button
                                    className="w-full sm:w-52 md:w-60 px-6 sm:px-8 md:px-10 py-4 md:py-5 text-sm md:text-base cursor-pointer"
                                    variant={"custom"}
                                >
                                    {translations.btn1}
                                </Button>
                            </Link>
                        </div>
                        <div className="hero-button">
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

            <div className="absolute -bottom-60 left-0 right-0 w-full z-0">
                <Image
                    src="/images/scroll-bg.webp"
                    alt="wave"
                    width={1920}
                    height={200}
                    className="w-full h-auto"
                    priority
                />
            </div>
        </div>
    );
};
