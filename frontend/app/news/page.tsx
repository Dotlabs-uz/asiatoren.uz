import NewsPageClient from "@/components/client/NewsPageClient";
import { getMediaSectionBySectionId, getNewsServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function NewsPage() {
    const t = await getTranslations("news-page");
    const [news, heroMediaArray] = await Promise.all([
        getNewsServer(),
        getMediaSectionBySectionId("news-banner"),
    ]);
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
        btn: t("btn"),
    };

    const heroMedia = heroMediaArray.length > 0 ? heroMediaArray[0] : null;

    return (
        <NewsPageClient
            translations={translations}
            news={news}
            locale={locale}
            heroMedia={heroMedia}
        />
    );
}
