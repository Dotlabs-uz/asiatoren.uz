"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MarqueeText } from "./MarqueeText";

gsap.registerPlugin(ScrollTrigger);

interface ScrollItem {
    type: "text" | "video";
    content?: string;
    src?: string;
    alt?: string;
    poster?: string;
    videoUrl?: string;
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

        // Первый элемент появляется сразу, остальные со смещением
        itemElements.forEach((element, index) => {
            if (index === 0) {
                // Первый элемент - минимальное смещение и почти виден
                gsap.set(element, {
                    opacity: 0.3, // Уже немного виден
                    y: 50, // Минимальное смещение
                    pointerEvents: "none",
                    zIndex: 0,
                });
            } else {
                gsap.set(element, {
                    opacity: 0,
                    y: 50,
                    pointerEvents: "none",
                    zIndex: 0,
                });
            }
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=400%",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
            },
        });

        itemElements.forEach((element, index) => {
            // Первый элемент появляется быстрее
            const appearDuration = index === 0 ? 0.5 : 1;
            const startTime = index === 0 ? 0 : index * 2;

            // Появление
            tl.to(
                element,
                {
                    opacity: 1,
                    y: 0,
                    duration: appearDuration,
                    ease: "power2.out",
                    onStart: () => {
                        gsap.set(element, {
                            pointerEvents: "auto",
                            zIndex: 50,
                        });
                    },
                    onReverseComplete: () => {
                        gsap.set(element, { pointerEvents: "none", zIndex: 0 });
                    },
                },
                startTime,
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
                        onStart: () => {
                            gsap.set(element, {
                                pointerEvents: "none",
                                zIndex: 0,
                            });
                        },
                        onReverseComplete: () => {
                            gsap.set(element, {
                                pointerEvents: "auto",
                                zIndex: 50,
                            });
                        },
                    },
                    startTime + (index === 0 ? 0.7 : 1.2),
                );
            }
        });

        return () => {
            if (ScrollTrigger.getById("mainTrigger")) {
                ScrollTrigger.getById("mainTrigger")?.kill();
            }
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
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            {item.type === "text" && (
                                <h2
                                    className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center text-gray-900 leading-tight px-4 max-w-5xl"
                                    dangerouslySetInnerHTML={{
                                        __html: item.content || "",
                                    }}
                                />
                            )}

                            {item.type === "video" && (
                                <div className="relative flex justify-center items-center w-full z-10 pointer-events-auto">
                                    <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border border-cGray">
                                        <iframe
                                            className="w-full h-full relative z-50"
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
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full -z-10 pointer-events-none">
                                        <MarqueeText text="ASIA TAREN POULTRY" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
