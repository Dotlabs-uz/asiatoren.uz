import DealersPageClient from "@/components/client/DealersPageClient";
import { getDealersServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function Dealers() {
    const t = await getTranslations("dealers-page");
    const dealers = await getDealersServer();
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
    };
    return (
        <div>
            <DealersPageClient
                translations={translations}
                data={dealers}
                locale={locale}
            />
        </div>
    );
}
