// components/client/ProductPageClient.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowRight, Shield, Truck, Home } from "lucide-react";
import { Language, Product } from "@/types";
import { ProductImageCarousel } from "./ProductImageCarousel"; // Изменено здесь

interface ProductPageClientProps {
    product: Product;
    categoryName: string;
    translations: {
        home: string;
        catalog: string;
        requestButton: string;
        warranty: string;
        warrantyText: string;
        delivery: string;
        deliveryText: string;
        selection: string;
        selectionText: string;
        descriptionTitle: string;
        characteristicsTitle: string;
        notFound: string;
        priceLabel: string;
        currency: string;
    };
    locale: Language;
}

export const ProductPageClient = ({
    product,
    categoryName,
    translations,
    locale,
}: ProductPageClientProps) => {
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(".breadcrumb", {
                y: -20,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out",
            });

            tl.from(
                ".product-image",
                {
                    x: -50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.3"
            );

            tl.from(
                ".product-title",
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.5"
            );

            tl.from(
                ".product-price",
                {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out",
                },
                "-=0.4"
            );

            tl.from(
                ".product-description",
                {
                    y: 20,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out",
                },
                "-=0.4"
            );

            tl.from(
                ".product-feature",
                {
                    x: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                },
                "-=0.3"
            );

            tl.from(
                ".request-button",
                {
                    y: 20,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                },
                "-=0.3"
            );

            tl.from(
                ".benefit-card",
                {
                    y: 40,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                },
                "-=0.2"
            );

            tl.from(
                ".content-section",
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: "power3.out",
                },
                "-=0.3"
            );
        });

        return () => ctx.revert();
    }, []);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-2xl text-gray-400">
                    {translations.notFound}
                </p>
            </div>
        );
    }

    const features = product.features || [];
    const halfLength = Math.ceil(features.length / 2);
    const leftFeatures = features.slice(0, halfLength);
    const rightFeatures = features.slice(halfLength);

    return (
        <div className="min-h-screen bg-white pt-10">
            {/* Hero Section */}
            <div
                ref={heroRef}
                className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-8 md:py-12"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left - Images Carousel */}
                    <ProductImageCarousel
                        images={product.images}
                        title={product.title[locale]}
                    />

                    {/* Right - Info */}
                    <div className="flex flex-col">
                        {/* Breadcrumbs */}
                        <div className="breadcrumb">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Link
                                    href={"/"}
                                    className="hover:text-cRed transition-colors"
                                >
                                    {translations.home}
                                </Link>
                                <ChevronRight className="w-4 h-4" />
                                <Link
                                    href={"/products"}
                                    className="hover:text-cRed transition-colors"
                                >
                                    {translations.catalog}
                                </Link>
                                <ChevronRight className="w-4 h-4" />
                                <span className="hover:text-cRed transition-colors">
                                    {categoryName}
                                </span>
                                <ChevronRight className="w-4 h-4" />
                                <span className="text-cRed font-medium">
                                    {product.title[locale]}
                                </span>
                            </div>
                        </div>
                        <h1 className="product-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            {product.title[locale]}
                        </h1>

                        {/* Price */}
                        <div className="product-price mb-6">
                            <p className="text-sm text-gray-500 mb-1">
                                {translations.priceLabel}
                            </p>
                            <p className="text-3xl md:text-4xl font-bold text-cRed">
                                {product.price.toLocaleString()}{" "}
                                <span className="text-2xl">
                                    {translations.currency}
                                </span>
                            </p>
                        </div>

                        <p className="product-description text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                            {product.description[locale]}
                        </p>

                        {/* Features in 2 columns */}
                        {features.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="space-y-3">
                                    {leftFeatures.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="product-feature flex items-start gap-3"
                                        >
                                            <div className="w-2 h-2 bg-cRed rounded-full mt-2 shrink-0" />
                                            <span className="text-gray-700">
                                                {feature[locale]}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    {rightFeatures.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="product-feature flex items-start gap-3"
                                        >
                                            <div className="w-2 h-2 bg-cRed rounded-full mt-2 shrink-0" />
                                            <span className="text-gray-700">
                                                {feature[locale]}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Request Button */}
                        <Button className="request-button w-full md:w-auto bg-cRed hover:bg-cRed/90 text-white px-10 py-6 text-lg font-semibold rounded-2xl group">
                            {translations.requestButton}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="benefit-card bg-gray-50 rounded-3xl p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-cRed/10 rounded-2xl flex items-center justify-center mb-4">
                            <Shield className="w-8 h-8 text-cRed" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {translations.warranty}
                        </h3>
                        <p className="text-gray-600">
                            {translations.warrantyText}
                        </p>
                    </div>

                    <div className="benefit-card bg-gray-50 rounded-3xl p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-cRed/10 rounded-2xl flex items-center justify-center mb-4">
                            <Truck className="w-8 h-8 text-cRed" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {translations.delivery}
                        </h3>
                        <p className="text-gray-600">
                            {translations.deliveryText}
                        </p>
                    </div>

                    <div className="benefit-card bg-gray-50 rounded-3xl p-8 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-cRed/10 rounded-2xl flex items-center justify-center mb-4">
                            <Home className="w-8 h-8 text-cRed" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {translations.selection}
                        </h3>
                        <p className="text-gray-600">
                            {translations.selectionText}
                        </p>
                    </div>
                </div>
            </div>

            {/* Description Section */}
            <div className="content-section max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-12 md:py-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {translations.descriptionTitle}
                </h2>
                <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed">
                        {product.description[locale]}
                    </p>
                </div>
            </div>

            {/* Characteristics Section */}
            {features.length > 0 && (
                <div className="content-section max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-12 md:py-16 bg-gray-50">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                        {translations.characteristicsTitle}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-5 bg-white rounded-2xl"
                            >
                                <div className="w-6 h-6 bg-cRed/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                    <div className="w-2 h-2 bg-cRed rounded-full" />
                                </div>
                                <span className="text-gray-700 text-base">
                                    {feature[locale]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
