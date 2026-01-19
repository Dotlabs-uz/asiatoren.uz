"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Banner } from "@/types";

export function BannerCarousel({ images }: { images: Banner[] }) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    // Инициализация плагина автопрокрутки
    const plugin = React.useRef(
        Autoplay({ delay: 4000, stopOnInteraction: true }),
    );

    React.useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="group relative w-full max-w-7xl mx-auto overflow-hidden rounded-2xl">
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                className="w-full"
                opts={{
                    loop: true, // Бесконечная прокрутка как в Uzum
                }}
            >
                <CarouselContent>
                    {images.map((banner) => (
                        <CarouselItem key={banner.id}>
                            <div className="relative h-[300px] w-full">
                                <Image
                                    src={banner.imageUrl}
                                    alt={`image-${banner.id}`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Кнопки навигации (появляются при наведении) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <CarouselPrevious className="left-4 h-10 w-10 border-none bg-white/80 hover:bg-white shadow-md" />
                    <CarouselNext className="right-4 h-10 w-10 border-none bg-white/80 hover:bg-white shadow-md" />
                </div>

                {/* Индикаторы (Точки) */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => api?.scrollTo(index)}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all",
                                current === index
                                    ? "bg-white w-6" // Активная точка длиннее
                                    : "bg-white/50 hover:bg-white/80",
                            )}
                        />
                    ))}
                </div>
            </Carousel>
        </div>
    );
}
