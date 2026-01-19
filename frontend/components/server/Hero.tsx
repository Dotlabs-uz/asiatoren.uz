import { getTranslations } from "next-intl/server";
import { HeroClient } from "../client/HeroClient";
import { getBannersServer } from "@/lib/firebase/server-api";

export default async function HeroSection() {
    const t = await getTranslations("hero");
    const banners = await getBannersServer();

    const translations = {
        title: t("title"),
        p: t("p"),
        btn1: t("btn1"),
        btn2: t("btn2"),
    };

    return (
        <section className="w-full h-[120vh] bg-[url('/images/hero-bg.webp')] bg-cover bg-center relative">
            {/* Темный оверлей для лучшей читаемости (опционально) */}
            <div className="absolute inset-0 bg-black/40"></div>

            <div className="relative z-10">
                <HeroClient translations={translations} banners={banners}/>
            </div>
        </section>
    );
}
