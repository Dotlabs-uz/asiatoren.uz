// components/client/FAQClient.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

gsap.registerPlugin(ScrollTrigger);

interface FAQ {
    question: string;
    answer: string;
}

interface FAQClientProps {
    faqs: FAQ[];
    translations: {
        subtitle: string;
        title: string;
    };
}

export const FAQClient = ({ faqs, translations }: FAQClientProps) => {
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
            tl.from(".faq-label", {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
            });

            // 2. Заголовок
            tl.from(
                ".faq-title",
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.3"
            );

            // 3. FAQ карточки с stagger
            tl.from(
                ".faq-item",
                {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                },
                "-=0.4"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full py-12 md:py-20 px-5 sm:px-8 lg:px-16 bg-gray-50"
        >
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 md:mb-16">
                    {/* Label */}
                    <div className="lg:col-span-3">
                        <span className="faq-label text-base md:text-lg text-gray-500 font-medium">
                            {translations.subtitle}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="lg:col-span-9">
                        <h2
                            className="faq-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cGray leading-tight"
                            dangerouslySetInnerHTML={{
                                __html: translations.title,
                            }}
                        />
                    </div>
                </div>

                {/* FAQ Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="faq-item">
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                <AccordionItem
                                    value={idx.toString()}
                                    className="border-none bg-white rounded-2xl md:rounded-3xl overflow-hidden"
                                >
                                    <AccordionTrigger className="px-6 md:px-8 py-6 md:py-8 hover:no-underline group transition-colors">
                                        <span className="text-base md:text-lg lg:text-xl font-bold text-left text-gray-900 pr-4">
                                            {faq.question}
                                        </span>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
