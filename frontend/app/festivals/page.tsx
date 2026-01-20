import FestivalsPageClient from "@/components/client/FestivalsPageClient";
import { getFestivalsServer, getMediaSectionBySectionId } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function FestivalsPage() {
    const t = await getTranslations("festivals-page");
    const [festivals, heroMediaArray] = await Promise.all([
        getFestivalsServer(),
        getMediaSectionBySectionId("festivals-banner"),
    ]);
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
        btn: t("btn"),
    };

    const heroMedia = heroMediaArray.length > 0 ? heroMediaArray[0] : null;

    return (
        <FestivalsPageClient
            translations={translations}
            festivals={festivals}
            locale={locale}
            heroMedia={heroMedia}
        />
    );
}
