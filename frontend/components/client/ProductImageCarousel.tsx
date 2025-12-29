// components/client/ProductImageCarousel.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductImageCarouselProps {
    images: string[];
    title: string;
}

export const ProductImageCarousel = ({
    images,
    title,
}: ProductImageCarouselProps) => {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="bg-gray-100 rounded-3xl aspect-square flex items-center justify-center">
                <div className="text-gray-300 text-6xl">📦</div>
            </div>
        );
    }

    return (
        <div className="product-image space-y-4">
            {/* Main Carousel */}
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {images.map((image, index) => (
                        <CarouselItem key={index}>
                            <div className="bg-gray-100 rounded-3xl aspect-square flex items-center justify-center p-8">
                                <Image
                                    src={image}
                                    alt={`${title} ${index + 1}`}
                                    width={600}
                                    height={600}
                                    className="w-full h-full object-contain"
                                    priority={index === 0}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`aspect-square bg-gray-100 rounded-2xl overflow-hidden p-3 transition-all duration-300 ${
                                selectedImage === index
                                    ? "ring-2 ring-cRed"
                                    : "hover:ring-2 hover:ring-gray-300"
                            }`}
                        >
                            <Image
                                src={image}
                                alt={`${title} thumbnail ${index + 1}`}
                                width={150}
                                height={150}
                                className="w-full h-full object-contain"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};