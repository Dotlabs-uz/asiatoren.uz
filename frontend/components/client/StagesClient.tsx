// components/client/StagesClient.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageSquare } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface Stage {
    number: number;
    title: string;
    description: string;
    isHighlighted?: boolean;
}

interface StagesClientProps {
    stages: Stage[];
    translations: {
        title: string;
        subtitle1: string;
        subtitle2: string;
        stageLabel: string;
    };
}

export const StagesClient = ({ stages, translations }: StagesClientProps) => {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitle1Ref = useRef<HTMLParagraphElement>(null);
    const subtitle2Ref = useRef<HTMLParagraphElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    end: "top 20%",
                    toggleActions: "play none none reverse",
                },
            });

            tl.from(titleRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });

            tl.from(
                subtitle1Ref.current,
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out",
                },
                "-=0.4"
            );

            tl.from(
                subtitle2Ref.current,
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out",
                },
                "-=0.4"
            );

            const cards = cardsRef.current.filter(Boolean);
            tl.from(
                cards,
                {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                },
                "-=0.3"
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="py-16 md:py-24 px-4 bg-linear-to-b from-white to-gray-50"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 md:mb-16">
                    <h2
                        ref={titleRef}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight"
                    >
                        {translations.title}
                    </h2>
                    <div className="space-y-3 md:space-y-4 max-w-3xl">
                        <p
                            ref={subtitle1Ref}
                            className="text-base md:text-lg text-gray-700 leading-relaxed"
                        >
                            {translations.subtitle1}
                        </p>
                        <p
                            ref={subtitle2Ref}
                            className="text-base md:text-lg text-gray-700 leading-relaxed"
                        >
                            {translations.subtitle2}
                        </p>
                    </div>
                </div>

                {/* Stages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Stage 1 */}
                    <div ref={(el) => { cardsRef.current[0] = el }}>
                        <StageCard
                            stage={stages[0]}
                            stageLabel={translations.stageLabel}
                        />
                    </div>

                    {/* Stage 2 */}
                    <div ref={(el) => { cardsRef.current[1] = el }}>
                        <StageCard
                            stage={stages[1]}
                            stageLabel={translations.stageLabel}
                        />
                    </div>

                    {/* Stage 3 */}
                    <div ref={(el) => { cardsRef.current[2] = el }}>
                        <StageCard
                            stage={stages[2]}
                            stageLabel={translations.stageLabel}
                        />
                    </div>

                    {/* Stage 4 */}
                    <div ref={(el) => { cardsRef.current[3] = el }}>
                        <StageCard
                            stage={stages[3]}
                            stageLabel={translations.stageLabel}
                        />
                    </div>

                    {/* Stage 5 */}
                    <div
                        ref={(el) => { cardsRef.current[4] = el }}
                        className="md:col-span-2 lg:col-span-2"
                    >
                        <StageCard
                            stage={stages[4]}
                            stageLabel={translations.stageLabel}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

function StageCard({
    stage,
    stageLabel,
}: {
    stage: Stage;
    stageLabel: string;
}) {
    const baseClasses =
        "group relative overflow-hidden rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl h-full";
    const bgClasses = stage.isHighlighted
        ? "bg-cRed text-white hover:scale-[1.02]"
        : "bg-gray-100 text-gray-900 hover:bg-white hover:shadow-lg";

    return (
        <div className={`${baseClasses} ${bgClasses}`}>
            {/* Stage Badge */}
            <div className="flex items-center gap-3 mb-6">
                <div
                    className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all duration-300 ${
                        stage.isHighlighted
                            ? "bg-white/20 group-hover:bg-white/30"
                            : "bg-cRed group-hover:scale-110"
                    }`}
                >
                    <MessageSquare className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div
                    className={`px-4 py-2 rounded-lg text-sm md:text-base font-semibold ${
                        stage.isHighlighted
                            ? "bg-white/20 text-white"
                            : "bg-gray-200 text-gray-700"
                    }`}
                >
                    {stage.number} {stageLabel}
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3 md:space-y-4">
                <h3
                    className={`text-xl md:text-2xl font-bold leading-tight ${
                        stage.isHighlighted ? "text-white" : "text-gray-900"
                    }`}
                >
                    {stage.title}
                </h3>
                <p
                    className={`text-sm md:text-base leading-relaxed ${
                        stage.isHighlighted ? "text-white/90" : "text-gray-600"
                    }`}
                >
                    {stage.description}
                </p>
            </div>

            {/* Decorative Element */}
            <div
                className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 transition-all duration-300 group-hover:scale-150 ${
                    stage.isHighlighted ? "bg-white" : "bg-cRed"
                }`}
            />
        </div>
    );
}