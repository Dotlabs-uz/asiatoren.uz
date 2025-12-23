import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function AboutSection() {
    const t = await getTranslations("about-us");

    return (
        <section className="w-full py-12 md:py-20 px-5 sm:px-8 lg:px-16 bg-white">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 md:mb-16">
                    {/* Label */}
                    <div className="lg:col-span-1">
                        <span className="text-base md:text-lg text-gray-500 font-medium">
                            {t("subtitle")}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="lg:col-span-2">
                        <h2
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cGray leading-tight"
                            dangerouslySetInnerHTML={{ __html: t.raw("title") }}
                        />
                    </div>

                    {/* Description */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            {t("p1")}
                        </p>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            {t("p2")}
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
                    {[0, 1, 2, 3].map((index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cRed">
                                {t(`stats.${index}.number`)}
                            </span>
                            <span className="text-sm md:text-base text-gray-600">
                                {t(`stats.${index}.label`)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Map */}
                <div className="w-full aspect-video lg:aspect-21/9 rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100">
                    <Image
                        src="/images/map.png"
                        alt="World Map"
                        width={5000}
                        height={5000}
                        loading="lazy"
                        className="w-full h-full object-contain bg-white"
                    />
                </div>
            </div>
        </section>
    );
}
