// components/client/AboutClient.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import WorldMap from "../ui/world-map";

gsap.registerPlugin(ScrollTrigger);

interface Stat {
    number: string;
    label: string;
}

interface AboutClientProps {
    translations: {
        subtitle: string;
        title: string;
        p1: string;
        p2: string;
        stats: Stat[];
    };
}

export const AboutClient = ({ translations }: AboutClientProps) => {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    end: "top 20%",
                    toggleActions: "play none none reverse",
                },
            });

            // 1. Label появляется
            tl.from(".about-label", {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
            });

            // 2. Заголовок
            tl.from(
                ".about-title",
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.3"
            );

            // 3. Параграфы
            tl.from(
                ".about-paragraph",
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: "power3.out",
                },
                "-=0.4"
            );

            // 4. Статистика появляется
            tl.from(
                ".stat-item",
                {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                },
                "-=0.3"
            );

            // 5. Анимация счетчика для каждой статистики (от 0 до значения)
            translations.stats.forEach((stat, index) => {
                const element = document.querySelector(`.stat-number-${index}`);
                if (!element) return;

                // Парсим число из строки
                const numStr = stat.number.replace(/[^\d]/g, "");
                const targetNum = parseInt(numStr) || 0;
                const suffix = stat.number.replace(/\d/g, "");

                // Устанавливаем начальное значение 0
                element.textContent = "0" + suffix;

                // Анимируем от 0 до целевого числа
                const obj = { value: 0 };

                tl.to(
                    obj,
                    {
                        value: targetNum,
                        duration: 2,
                        ease: "power2.out",
                        onUpdate: function () {
                            const currentValue = Math.floor(obj.value);
                            if (element) {
                                // Форматируем большие числа
                                const formatted =
                                    targetNum > 1000
                                        ? currentValue.toLocaleString("ru-RU")
                                        : currentValue.toString();
                                element.textContent = formatted + suffix;
                            }
                        },
                    },
                    "-=1.8" // Начинается почти одновременно с появлением
                );
            });

            // 6. Карта
            tl.from(
                ".about-map",
                {
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                    duration: 1,
                    ease: "power3.out",
                },
                "-=1.5"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [translations.stats]);

    return (
        <section
            ref={sectionRef}
            className="w-full py-12 md:py-20 px-5 sm:px-8 lg:px-16 bg-white"
        >
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 md:mb-16">
                    {/* Label */}
                    <div className="lg:col-span-1">
                        <span className="about-label text-base md:text-lg text-gray-500 font-medium">
                            {translations.subtitle}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="lg:col-span-2">
                        <h2
                            className="about-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cGray leading-tight"
                            dangerouslySetInnerHTML={{
                                __html: translations.title,
                            }}
                        />
                    </div>

                    {/* Description */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <p className="about-paragraph text-base md:text-lg text-gray-600 leading-relaxed">
                            {translations.p1}
                        </p>
                        <p className="about-paragraph text-base md:text-lg text-gray-600 leading-relaxed">
                            {translations.p2}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
                    {translations.stats.map((stat, index) => (
                        <div
                            key={index}
                            className="stat-item flex flex-col gap-2"
                        >
                            <span
                                className={`stat-number-${index} text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cRed`}
                            >
                                {stat.number}
                            </span>
                            <span className="text-sm md:text-base text-gray-600">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Map */}
                <div className="dark:bg-black bg-white w-full">
                    <WorldMap
                        lineColor="#de2b1c"
                        dots={[
                            {
                                start: { lat: 41.3775, lng: 64.5853 }, // Узбекистан (Бухара)
                                end: { lat: 17.0, lng: 42.0 }, // Саудовская Аравия (юго-западная точка, граница с Йеменом)
                            },
                            {
                                start: { lat: 41.3775, lng: 64.5853 }, // Узбекистан
                                end: { lat: 77.5, lng: 104.0 }, // Россия (мыс Челюскин - самая северная точка)
                            },
                            {
                                start: { lat: 41.3775, lng: 64.5853 }, // Узбекистан
                                end: { lat: 25.0, lng: 60.5 }, // Иран (юго-восточная точка, граница с Пакистаном)
                            },
                            {
                                start: { lat: 41.3775, lng: 64.5853 }, // Узбекистан
                                end: { lat: 47.2701, lng: 7.4 }, // Германия (юго-западная точка, граница со Швейцарией)
                            },
                            {
                                start: { lat: 41.3775, lng: 64.5853 }, // Узбекистан
                                end: { lat: 36.0, lng: 26.0 }, // Турция (юго-западная точка, остров в Эгейском море)
                            },
                        ]}
                    />
                </div>
            </div>
        </section>
    );
};
