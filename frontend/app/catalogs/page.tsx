import CatalogsPageClient from "@/components/client/CatalogsPageClient";
import { getCatalogsServer, getMediaSectionBySectionId } from "@/lib/firebase/server-api";
import { Catalog, Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function CatalogsPage() {
    const t = await getTranslations("catalogs-page");
    const [catalogues, heroMediaArray] = await Promise.all([
        getCatalogsServer(),
        getMediaSectionBySectionId("catalogs-banner"),
    ]);
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
    };

    const heroMedia = heroMediaArray.length > 0 ? heroMediaArray[0] : null;

    return (
        <div>
            <CatalogsPageClient
                translations={translations}
                catalogues={catalogues}
                locale={locale}
                heroMedia={heroMedia}
            />
        </div>
    );
}
