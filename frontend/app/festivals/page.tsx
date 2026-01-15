import FestivalsPageClient from "@/components/client/FestivalsPageClient";
import { getFestivalsServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function FestivalsPage() {
    const t = await getTranslations("festivals-page");
    const festivals = await getFestivalsServer();
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
        btn: t("btn"),
    };

    return (
        <FestivalsPageClient
            translations={translations}
            festivals={festivals}
            locale={locale}
        />
    );
}
