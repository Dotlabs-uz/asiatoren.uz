// components/client/ProductsClient.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Language, Product } from "@/types";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface ProductsClientProps {
    products: Product[];
    translations: {
        subtitle: string;
        title: string;
        btn: string;
    };
    locale: Language;
}

export const ProductsClient = ({
    products,
    translations,
    locale,
}: ProductsClientProps) => {
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

            tl.from(".about-label", {
                y: 30,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
            });

            tl.from(".products-title", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });

            tl.from(
                ".products-button",
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.6"
            );

            tl.from(
                ".product-card-wrapper",
                {
                    y: 60,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power3.out",
                },
                "-=0.3"
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="w-full py-12 md:py-20 px-5 sm:px-8 lg:px-16 bg-white"
        >
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 md:mb-16">
                    <div className="lg:col-span-1">
                        <span className="about-label text-base md:text-lg text-gray-500 font-medium">
                            {translations.subtitle}
                        </span>
                    </div>

                    <h2 className="products-title lg:col-span-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cGray">
                        {translations.title}
                    </h2>

                    <div className="products-button lg:col-span-2 flex justify-end md:w-auto">
                        <Link href={"/products"}>
                            <Button className="group flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 w-full md:w-60 justify-center transition-all duration-300">
                                {translations.btn}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 mt-32">
                    {products &&
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="product-card-wrapper self-end relative"
                            >
                                <Link href={`/products/${product.id}`}>
                                    <div className="group h-40 md:h-48 bg-gray-200 rounded-2xl overflow-hidden transition-all duration-700 ease-out hover:bg-cRed hover:h-64 md:hover:h-80 hover:-mt-8 md:hover:-mt-16 cursor-pointer shadow-lg hover:shadow-2xl">
                                        {/* Image Container */}
                                        <div className="absolute -top-12 md:-top-20 left-1/2 -translate-x-1/2 w-full flex items-center justify-center transition-all duration-700 group-hover:scale-105 group-hover:-top-8">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title[locale]}
                                                width={1000}
                                                height={1000}
                                                className="size-52 object-contain"
                                                priority
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-cGray transition-colors duration-500 group-hover:text-white line-clamp-2">
                                                    {product.title[locale]}
                                                </h3>

                                                {/* Arrow Button */}
                                                <ArrowRight className="w-6 h-6 md:w-7 md:h-7 text-cGray group-hover:text-white transition-transform duration-500 group-hover:translate-x-0.5" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">
                            В этой категории пока нет продуктов
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
