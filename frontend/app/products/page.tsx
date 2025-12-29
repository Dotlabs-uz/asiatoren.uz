import { getLocale, getTranslations } from "next-intl/server";
import { CatalogClient } from "@/components/client/Catalog";
import { getCategoriesServer, getProductsServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";

export default async function CatalogPage() {
    const t = await getTranslations("catalog");
    const products = await getProductsServer();
    const categories = await getCategoriesServer();
    const locale = await getLocale() as Language

    const translations = {
        title: t("title"),
        searchPlaceholder: t("searchPlaceholder"),
        all: t("all"),
        viewButton: t("viewButton"),
        notFound: t("notFound"),
        tryAgain: t("tryAgain"),
    };

    return (
        <CatalogClient
            initialCategories={categories}
            initialProducts={products}
            translations={translations}
            locale={locale}
        />
    );
}
