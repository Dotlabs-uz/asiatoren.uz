"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface ScrollItem {
    type: "text" | "image" | "video";
    content?: string;
    src?: string;
    alt?: string;
    poster?: string;
    videoUrl?: string; // Для YouTube URL
}

interface ScrollMainClientProps {
    items: ScrollItem[];
}

export const ScrollMainClient = ({ items }: ScrollMainClientProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!sectionRef.current) return;

        const section = sectionRef.current;
        const itemElements = itemsRef.current.filter(Boolean);

        // Скрываем все элементы изначально
        gsap.set(itemElements, { opacity: 0, y: 50 });

        // Создаем timeline с ScrollTrigger
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=400%", // Длина скролла
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        // Анимация каждого элемента
        itemElements.forEach((element, index) => {
            // Появление
            tl.to(
                element,
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                },
                index * 2
            );

            // Исчезновение (кроме последнего)
            if (index < itemElements.length - 1) {
                tl.to(
                    element,
                    {
                        opacity: 0,
                        y: -50,
                        duration: 0.8,
                        ease: "power2.in",
                    },
                    index * 2 + 1.2
                );
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [items]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full h-screen bg-white overflow-hidden"
        >
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-[1400px] w-full px-5 sm:px-8 lg:px-16">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            ref={(el) => {
                                itemsRef.current[index] = el;
                            }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            {item.type === "text" && (
                                <h2
                                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center text-gray-900 leading-tight px-4 max-w-5xl"
                                    dangerouslySetInnerHTML={{
                                        __html: item.content || "",
                                    }}
                                />
                            )}

                            {item.type === "image" && (
                                <div className="relative w-full max-w-2xl aspect-square">
                                    <Image
                                        src={item.src || ""}
                                        alt={item.alt || ""}
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        loading="lazy"
                                    />
                                </div>
                            )}

                            {item.type === "video" && (
                                <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-cGray">
                                    <iframe
                                        className="w-full h-full"
                                        src={
                                            item.videoUrl ||
                                            "https://www.youtube.com/embed/Riv1FdyvFxs?si=qe5_Hnx6g9OPwFkE"
                                        }
                                        title="YouTube video player"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerPolicy="strict-origin-when-cross-origin"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
