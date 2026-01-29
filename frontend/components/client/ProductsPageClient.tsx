// components/client/ProductsPageClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category, Language, Product, MediaSection } from "@/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
    getProducts,
    getProductsByCategory,
    searchProducts,
} from "@/lib/firebase/public-api";
import Link from "next/link";
import { Pagination } from "./Pagination";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ProductsPageClientProps {
    initialCategories: Category[];
    initialProducts: Product[];
    heroMedia: MediaSection | null; // Добавили медиа
    translations: {
        title: string;
        searchPlaceholder: string;
        all: string;
        viewButton: string;
        notFound: string;
        tryAgain: string;
        showing: string;
        of: string;
        products: string;
    };
    locale: Language;
}

const PRODUCTS_PER_PAGE = 16;

export const ProductsPageClient = ({
    initialCategories,
    initialProducts,
    heroMedia,
    translations,
    locale,
}: ProductsPageClientProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const containerRef = useRef<HTMLDivElement>(null);
    const productsGridRef = useRef<HTMLDivElement>(null);

    // Вычисляем пагинацию
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const endIndex = startIndex + PRODUCTS_PER_PAGE;
    const currentProducts = products.slice(startIndex, endIndex);

    // Начальная анимация
    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(".hero-title", {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: "power3.out",
                delay: 0.2,
            });

            gsap.from(".search-bar", {
                y: 60,
                opacity: 0,
                scale: 0.95,
                duration: 1,
                ease: "back.out(1.2)",
                delay: 0.5,
            });

            gsap.from(".category-tab", {
                x: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power3.out",
                delay: 0.8,
            });

            gsap.from(".product-card", {
                y: 80,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: "power3.out",
                delay: 1,
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Загрузка продуктов при изменении категории
    useEffect(() => {
        const loadProducts = async () => {
            if (!searchQuery) {
                setLoading(true);
                try {
                    let newProducts: Product[];
                    if (selectedCategory === "all") {
                        newProducts = await getProducts({
                            limit: PRODUCTS_PER_PAGE,
                        });
                    } else {
                        newProducts = await getProductsByCategory(
                            selectedCategory,
                            PRODUCTS_PER_PAGE,
                        );
                    }
                    setProducts(newProducts);
                    setCurrentPage(1);

                    setTimeout(() => {
                        animateProducts();
                    }, 100);
                } catch (error) {
                    console.error("Error loading products:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadProducts();
    }, [selectedCategory, searchQuery]);

    // Поиск продуктов с debounce
    useEffect(() => {
        if (searchQuery) {
            const timeoutId = setTimeout(async () => {
                setLoading(true);
                try {
                    const results = await searchProducts(searchQuery, locale);
                    setProducts(results);
                    setCurrentPage(1);

                    setTimeout(() => {
                        animateProducts();
                    }, 100);
                } catch (error) {
                    console.error("Error searching products:", error);
                } finally {
                    setLoading(false);
                }
            }, 500);

            return () => clearTimeout(timeoutId);
        }
    }, [searchQuery, locale]);

    // Анимация при смене страницы
    useEffect(() => {
        if (currentPage > 1) {
            productsGridRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });

            setTimeout(() => {
                animateProducts();
            }, 300);
        }
    }, [currentPage]);

    // Функция анимации продуктов
    const animateProducts = () => {
        gsap.fromTo(
            ".product-card",
            {
                y: 60,
                opacity: 0,
                scale: 0.9,
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.08,
                ease: "power3.out",
            },
        );
    };

    // Обработчик смены страницы
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-white">
            {/* Hero Section with Dynamic Media */}
            <div className="relative w-full h-[50vh] flex items-center justify-center overflow-hidden">
                {/* Динамическое медиа (изображение или видео) */}
                {heroMedia ? (
                    <>
                        {heroMedia.mediaType === "image" ? (
                            <Image
                                src={heroMedia.mediaUrl}
                                alt={
                                    heroMedia.description ||
                                    "Products background"
                                }
                                fill
                                className="object-cover"
                                priority
                                quality={90}
                            />
                        ) : (
                            <video
                                src={heroMedia.mediaUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                poster={heroMedia.thumbnailUrl}
                                className="absolute inset-0 w-full h-full object-cover"
                            >
                                <source
                                    src={heroMedia.mediaUrl}
                                    type="video/mp4"
                                />
                            </video>
                        )}
                    </>
                ) : (
                    // Фолбэк: дефолтное изображение
                    <div className="absolute inset-0 bg-[url('/images/products-bg.webp')] bg-cover bg-center bg-no-repeat" />
                )}

                {/* Темный оверлей */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Заголовок */}
                <h2 className="hero-title relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-bold text-center px-4">
                    {translations.title}
                </h2>
            </div>

            {/* Search and Filters */}
            <div className="max-w-[1400px] mx-auto px-2 sm:px-8 lg:px-16 -mt-20 relative z-20">
                <div className="search-bar bg-white rounded-3xl shadow-2xl p-4 md:p-6 mb-8">
                    {/* Search Input */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder={translations.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-12 md:h-14 text-base md:text-lg border-none bg-gray-50 rounded-2xl focus-visible:ring-2 focus-visible:ring-cRed"
                        />
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 pb-2">
                        <Button
                            onClick={() => {
                                setSelectedCategory("all");
                                setSearchQuery("");
                            }}
                            className={`category-tab px-4 py-2 text-sm md:text-base rounded-xl font-semibold transition-all duration-300 ${
                                selectedCategory === "all"
                                    ? "bg-cRed text-white hover:bg-cRed/90"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {translations.all}
                        </Button>
                        {initialCategories.map((category) => (
                            <Button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    setSearchQuery("");
                                }}
                                className={`category-tab px-4 py-2 text-sm md:text-base rounded-xl font-semibold transition-all duration-300 ${
                                    selectedCategory === category.id
                                        ? "bg-cRed text-white hover:bg-cRed/90"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {category.title[locale]}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div
                ref={productsGridRef}
                className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-12"
            >
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cRed"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                            {currentProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="product-card group relative bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-500 border border-gray-200 flex flex-col justify-between"
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
                                                {product.title[locale].length <
                                                50
                                                    ? product.title[locale]
                                                    : product.title[
                                                          locale
                                                      ].slice(0, 50) + "..."}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                                {product.description[locale]}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mx-4 mb-4">
                                        <Link href={"/products/" + product.id}>
                                            <Button className="w-full bg-cRed hover:bg-cRed/90 text-white rounded-xl font-semibold group/btn transition-all cursor-pointer">
                                                <span>
                                                    {translations.viewButton}
                                                </span>
                                                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Component */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            showInfo={true}
                            infoText={{
                                showing: translations.showing,
                                of: translations.of,
                                items: translations.products,
                            }}
                            totalItems={products.length}
                            itemsPerPage={PRODUCTS_PER_PAGE}
                        />

                        {/* Empty State */}
                        {products.length === 0 && !loading && (
                            <div className="text-center py-20">
                                <p className="text-2xl text-gray-400 mb-4">
                                    {translations.notFound}
                                </p>
                                <p className="text-gray-500">
                                    {translations.tryAgain}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
