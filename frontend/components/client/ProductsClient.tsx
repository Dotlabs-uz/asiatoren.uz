// components/client/ProductsClient.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Category, Product } from "@/types";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

interface ProductsClientProps {
    products: Product[];
    translations: {
        title: string;
        btn: string;
    };
}

export const ProductsClient = ({
    products,
    translations,
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

            // 1. Заголовок
            tl.from(".products-title", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });

            // 2. Кнопка
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

            // 4. Карточки продуктов - ОБЕРНУТЫЕ В DIV
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center lg:items-center gap-8 mb-8 md:mb-12">
                    <h2 className="products-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cGray">
                        {translations.title}
                    </h2>

                    <div className="products-button w-full md:w-auto">
                        <Link href={"/products"}>
                            <Button className="group flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 w-full md:w-60 justify-center transition-all duration-300">
                                {translations.btn}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                    {products.map((product) => (
                        <div key={product.id} className="product-card-wrapper">
                            <Link href={"/products/" + product.id}>
                                <div className="group relative overflow-hidden rounded-xl md:rounded-2xl transition-all duration-500 hover:scale-[1.02] bg-gray-100 text-gray-900 hover:shadow-2xl w-full h-full">
                                    {/* Card Content */}
                                    <div className="relative z-10 p-4 md:p-6 flex flex-col justify-between min-h-[280px] md:min-h-80">
                                        {/* Product Image */}
                                        {product.images?.[0] && (
                                            <div className="flex-1 flex items-center justify-center mb-4">
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="w-full h-32 md:h-40 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        )}

                                        {/* Product Name */}
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-base md:text-lg lg:text-xl font-bold text-left line-clamp-2 text-gray-900 transition-colors duration-300">
                                                {product.title}
                                            </h3>
                                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 shrink-0 group-hover:translate-x-2 transition-transform duration-300 text-gray-900" />
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
