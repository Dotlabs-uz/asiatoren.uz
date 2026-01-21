"use client";

import { Media } from "@/types";
import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CertificatesSectionProps {
    translations: {
        label: string;
        title: string;
        p1: string;
        p2: string;
    };
    certificates: Media[];
}

export default function CertificatesSection({
    translations,
    certificates,
}: CertificatesSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Certificates Section
            gsap.from(".certificates-section", {
                scrollTrigger: {
                    trigger: ".certificates-section",
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
            });

            // Certificate Cards
            gsap.from(".certificates-card", {
                scrollTrigger: {
                    trigger: ".certificates-card",
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="bg-white py-16 md:py-24">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">
                {/* Header Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-8 lg:gap-12 mb-12">
                    {/* Label */}
                    <div className="certificates-section">
                        <div className="text-sm font-semibold text-gray-500">
                            {translations.label}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="certificates-section">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            {translations.title}
                        </h2>
                    </div>

                    {/* Description */}
                    <div className="certificates-section space-y-4">
                        <p className="text-base text-gray-600 leading-relaxed">
                            {translations.p1}
                        </p>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {translations.p2}
                        </p>
                    </div>
                </div>

                {/* Certificates Scroll */}
                <div className="overflow-x-auto pb-4 -mx-5 sm:-mx-8 lg:-mx-16">
                    <div className="flex gap-4 lg:gap-6 px-5 sm:px-8 lg:px-16">
                        {certificates.map((item, i) => (
                            <div
                                key={i}
                                className="certificates-card relative w-[200px] aspect-3/4 bg-gray-100 rounded-2xl overflow-hidden shrink-0"
                            >
                                <Image
                                    src={item.imageUrl}
                                    alt="certificate"
                                    loading="lazy"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
