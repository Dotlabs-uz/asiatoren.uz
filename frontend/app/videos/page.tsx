import VideoGridClient from "@/components/client/VideosGridClient";
import { getVideosServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function VideosPage() {
    const videos = await getVideosServer();
    const t = await getTranslations("videos-page");
    const locale = (await getLocale()) as Language;

    return (
        <div className="flex flex-col items-center pb-20">
            {/* Декоративная шапка */}
            <div className="w-full bg-cRed/60 h-20 mb-10 md:mb-16" />

            <div className="max-w-[1400px] w-full px-5 sm:px-8 lg:px-16">
                <div className="flex flex-col justify-center items-center gap-4 mb-10 md:mb-16">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold">
                        {t("title")}
                    </h1>
                </div>

                {/* Сетка видео */}
                <VideoGridClient videos={videos} locale={locale} />
            </div>
        </div>
    );
}
