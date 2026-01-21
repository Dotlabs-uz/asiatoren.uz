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
        prod_btn: string;
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
            // Установите начальное состояние для карточек
            gsap.set(".product-card-wrapper", {
                opacity: 1,
                y: 0,
            });

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
                "-=0.6",
            );

            tl.from(
                ".product-card-wrapper",
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=2",
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
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 mt-32">
                    {products &&
                        products.map((product) => (
                            <div
                                key={product.id}
                                className="product-card-wrapper group relative bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-500 border border-gray-200 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative h-64 flex items-center justify-center overflow-hidden">
                                        {product.images?.[0] ? (
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title[locale]}
                                                width={1000}
                                                height={1000}
                                                className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="text-gray-300 text-4xl">
                                                📦
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-4">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-cRed transition-colors">
                                            {product.title[locale].length < 50
                                                ? product.title[locale]
                                                : product.title[locale].slice(
                                                      0,
                                                      50,
                                                  ) + "..."}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                            {product.description[locale]}
                                        </p>
                                    </div>
                                </div>
                                <div className="mx-4 mb-4">
                                    <Link href={"/products/" + product.id}>
                                        <Button className="w-full bg-cRed hover:bg-cRed/90 text-white rounded-xl font-semibold group/btn transition-all cursor-pointer">
                                            <span>{translations.prod_btn}</span>
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
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
