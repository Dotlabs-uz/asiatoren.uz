import DealersPageClient from "@/components/client/DealersPageClient";
import { getDealersServer, getMediaSectionBySectionId } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Dealers() {
    const t = await getTranslations("dealers-page");
    const [dealers, heroMediaArray] = await Promise.all([
        getDealersServer(),
        getMediaSectionBySectionId("dealers-banner"),
    ]);
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
    };
    
    const heroMedia = heroMediaArray.length > 0 ? heroMediaArray[0] : null;

    return (
        <div>
            <DealersPageClient
                translations={translations}
                data={dealers}
                locale={locale}
                heroMedia={heroMedia}
            />
        </div>
    );
}
