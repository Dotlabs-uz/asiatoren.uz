import { getTranslations } from "next-intl/server";
import { HeroClient } from "../client/HeroClient";
import { getMediaSectionBySectionId } from "@/lib/firebase/server-api";
import Image from "next/image";

export default async function HeroSection() {
    const t = await getTranslations("hero");

    const translations = {
        title: t("title"),
        p: t("p"),
        btn1: t("btn1"),
        btn2: t("btn2"),
    };

    // Получаем медиа для hero секции
    const heroMedia = await getMediaSectionBySectionId("home-hero");
    const media = heroMedia.length > 0 ? heroMedia[0] : null;

    return (
        <section className="w-full h-[120vh] relative overflow-hidden">
            {/* Медиа фон (изображение или видео) */}
            {media ? (
                <>
                    {media.mediaType === "image" ? (
                        <Image
                            src={media.mediaUrl}
                            alt={media.description || "Hero background"}
                            fill
                            className="object-cover"
                            priority
                            quality={90}
                        />
                    ) : (
                        <>
                            {/* Thumbnail как placeholder для видео */}
                            {media.thumbnailUrl && (
                                <Image
                                    src={media.thumbnailUrl}
                                    alt="Video thumbnail"
                                    fill
                                    className="object-cover"
                                    priority
                                    quality={90}
                                />
                            )}
                            {/* Видео */}
                            <video
                                src={media.mediaUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                poster={media.thumbnailUrl}
                                className="absolute inset-0 w-full h-full object-cover"
                            >
                                <source src={media.mediaUrl} type="video/mp4" />
                            </video>
                        </>
                    )}
                </>
            ) : (
                // Фолбэк: дефолтное изображение если медиа не загружено
                <Image
                    src="/images/hero-bg.webp"
                    alt="Hero background"
                    fill
                    className="object-cover"
                    priority
                    quality={90}
                />
            )}

            {/* Темный оверлей для лучшей читаемости */}
            <div className="absolute inset-0 bg-black/40 z-1"></div>

            {/* Контент */}
            <div className="relative z-10">
                <HeroClient translations={translations} />
            </div>
        </section>
    );
}
