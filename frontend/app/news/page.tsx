import NewsPageClient from "@/components/client/NewsPageClient";
import { getNewsServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function NewsPage() {
    const t = await getTranslations("news-page");
    const news = await getNewsServer();
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
        btn: t("btn"),
    };

    return (
        <NewsPageClient
            translations={translations}
            news={news}
            locale={locale}
        />
    );
}
