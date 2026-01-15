import CatalogsPageClient from "@/components/client/CatalogsPageClient";
import { getCatalogsServer } from "@/lib/firebase/server-api";
import { Catalog, Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function CatalogsPage() {
    const t = await getTranslations("catalogs-page");
    const catalogues: Catalog[] = await getCatalogsServer();
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
    };

    return (
        <div>
            <CatalogsPageClient
                translations={translations}
                catalogues={catalogues}
                locale={locale}
            />
        </div>
    );
}
