"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import AboutSection from "../server/About";
import { AboutClient } from "./AboutClient";
import { Media } from "@/types";
import Image from "next/image";
import { Separator } from "../ui/separator";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface AboutPageClientProps {
    translations: any;
    aboutSectionTranslations?: any;
    videoUrl?: string;
    certificates: Media[];
    partners: Media[];
}

export const AboutPageClient = ({
    translations,
    aboutSectionTranslations,
    videoUrl = "https://www.youtube.com/embed/Riv1FdyvFxs?si=qe5_Hnx6g9OPwFkE",
    certificates,
    partners,
}: AboutPageClientProps) => {
    const [showVideo, setShowVideo] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Hero animations
            gsap.from(".hero-title", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.2,
            });

            gsap.from(".hero-subtitle", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.5,
            });

            // About Company Section - with ScrollTrigger
            gsap.from(".about-section", {
                scrollTrigger: {
                    trigger: ".about-section",
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                y: 80,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
            });

            // Video Container
            gsap.from(".video-container", {
                scrollTrigger: {
                    trigger: ".video-container",
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                scale: 0.9,
                opacity: 0,
                duration: 1,
                ease: "back.out(1.2)",
            });

            // Stages Section
            gsap.from(".stages-section", {
                scrollTrigger: {
                    trigger: ".stages-section",
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
            });

            // Stage Cards
            gsap.from(".stage-card", {
                scrollTrigger: {
                    trigger: ".stage-card",
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
            });

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

            // Partners Section
            gsap.from(".partners-section", {
                scrollTrigger: {
                    trigger: ".partners-section",
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
            });

            // Partner Cards
            gsap.from(".partners-card", {
                scrollTrigger: {
                    trigger: ".partners-card",
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
        <div ref={containerRef} className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative bg-[url('/images/about.webp')] bg-cover bg-center bg-no-repeat w-full h-[70vh] flex items-center justify-center">
                <div className="absolute inset-0 bg-black/30" />
                <div className="flex flex-col justify-center items-center gap-4">
                    <h1 className="hero-title relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-bold text-center px-4">
                        {translations.hero.title}
                    </h1>
                    <p className="hero-subtitle relative z-10 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-medium text-center px-4 max-w-4xl">
                        {translations.hero.subtitle}
                    </p>
                </div>
            </div>

            {/* About Company Section */}
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-16 md:py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 items-start">
                    {/* About Label */}
                    <div className="about-section md:col-span-1 lg:col-span-1 text-sm font-semibold text-gray-500 pt-2">
                        {translations.sections.aboutCompany}
                    </div>

                    {/* Title */}
                    <h2 className="about-section md:col-span-2 lg:col-span-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cGray leading-tight">
                        {translations.sections.equipment.title}
                    </h2>

                    {/* Description */}
                    <div className="about-section space-y-6 md:col-span-3 lg:col-span-2">
                        <p className="text-lg text-gray-700 font-semibold">
                            {translations.sections.equipment.production}
                        </p>
                        <p className="text-base text-gray-600 leading-relaxed">
                            {translations.sections.equipment.description}
                        </p>
                    </div>
                </div>

                {/* Video Section */}
                <div className="mt-16 video-container">
                    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl aspect-video bg-gray-900">
                        {!showVideo ? (
                            <div
                                className="absolute inset-0 bg-[url('/images/about.webp')] bg-cover bg-center cursor-pointer group"
                                onClick={() => setShowVideo(true)}
                            >
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 md:w-10 md:h-10 text-cRed ml-1" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <iframe
                                src={videoUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Stages Section */}
            <div className="bg-gray-50 py-16 md:py-24">
                <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
                        <div className="stages-section md:col-span-1 text-sm font-semibold text-gray-500 pt-2">
                            {translations.sections.stages.subtitle}
                        </div>

                        <h2 className="stages-section md:col-span-2 text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                            {translations.sections.stages.title}
                        </h2>

                        <div className="stages-section space-y-6 md:col-span-3 lg:col-span-2">
                            <p className="text-base text-gray-600 leading-relaxed">
                                {
                                    translations.sections.stages
                                        .projectDescription
                                }
                            </p>
                            <p className="text-base text-gray-600 leading-relaxed">
                                {translations.sections.stages.clientTasks}
                            </p>
                        </div>
                    </div>

                    {/* Steps Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 lg:divide-x lg:divide-dashed lg:divide-gray-300">
                        {/* Step 01 */}
                        <div className="stage-card px-0 lg:pr-8 py-8 lg:py-0">
                            <div className="text-7xl md:text-8xl font-bold text-cRed mb-4 leading-none">
                                01
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                {translations.sections.stages.step1.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                                {translations.sections.stages.step1.description}
                            </p>
                        </div>

                        {/* Step 02 */}
                        <div className="stage-card px-0 lg:px-8 py-8 pt-14">
                            <div className="text-7xl md:text-8xl font-bold text-cRed mb-4 leading-none">
                                02
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                {translations.sections.stages.step2.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                                {translations.sections.stages.step2.description}
                            </p>
                        </div>

                        {/* Step 03 */}
                        <div className="stage-card px-0 lg:px-8 py-8 pt-28">
                            <div className="text-7xl md:text-8xl font-bold text-cRed mb-4 leading-none">
                                03
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                {translations.sections.stages.step3.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                                {translations.sections.stages.step3.description}
                            </p>
                        </div>

                        {/* Step 04 */}
                        <div className="stage-card px-0 lg:pl-8 py-8 pt-40">
                            <div className="text-7xl md:text-8xl font-bold text-cRed mb-4 leading-none">
                                04
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                                {translations.sections.stages.step4.title}
                            </h3>
                            <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                                {translations.sections.stages.step4.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Company */}
            <AboutClient translations={aboutSectionTranslations} />

            {/* Certificates Section */}
            <div className="bg-white py-16 md:py-24">
                <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">
                    {/* Header Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-8 lg:gap-12 mb-12">
                        {/* Label */}
                        <div className="certificates-section">
                            <div className="text-sm font-semibold text-gray-500">
                                {translations.sections.certificates.label}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="certificates-section">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                {translations.sections.certificates.title}
                            </h2>
                        </div>

                        {/* Description */}
                        <div className="certificates-section space-y-4">
                            <p className="text-base text-gray-600 leading-relaxed">
                                {translations.sections.certificates.p1}
                            </p>
                            <p className="text-base text-gray-600 leading-relaxed">
                                {translations.sections.certificates.p2}
                            </p>
                        </div>
                    </div>

                    {/* Certificates Scroll */}
                    <div className="overflow-x-auto pb-4 -mx-5 sm:-mx-8 lg:-mx-16">
                        <div className="flex gap-4 lg:gap-6 px-5 sm:px-8 lg:px-16">
                            {certificates.map((item, i) => (
                                <div
                                    key={i}
                                    className="certificates-card w-[200px] aspect-3/4 bg-gray-100 rounded-2xl overflow-hidden shrink-0"
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

            {/* Partners Section */}
            <div className="bg-white py-16 md:py-24">
                <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">
                    {/* Header Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_1fr] gap-8 lg:gap-12 mb-12">
                        {/* Label */}
                        <div className="partners-section">
                            <div className="text-sm font-semibold text-gray-500">
                                {translations.sections.partners.label}
                            </div>
                        </div>

                        {/* Title */}
                        <div className="partners-section">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                {translations.sections.partners.title}
                            </h2>
                        </div>

                        {/* Description */}
                        <div className="partners-section space-y-4">
                            <p className="text-base text-gray-600 leading-relaxed">
                                {translations.sections.partners.p1}
                            </p>
                            <p className="text-base text-gray-600 leading-relaxed">
                                {translations.sections.partners.p2}
                            </p>
                        </div>
                    </div>

                    {/* Partners Scroll */}
                    <div className="overflow-x-auto pb-4 -mx-5 sm:-mx-8 lg:-mx-16">
                        <div className="flex gap-4 lg:gap-6 px-5 sm:px-8 lg:px-16">
                            {partners.map((partner, i) => (
                                <div
                                    key={i}
                                    className="partners-card w-[200px] aspect-3/2 bg-gray-100 rounded-2xl flex items-center justify-center p-6 shrink-0"
                                >
                                    <Image
                                        src={partner.imageUrl}
                                        alt="partner title"
                                        loading="lazy"
                                        fill
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
