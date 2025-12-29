import { getLocale, getTranslations } from "next-intl/server";
import { ProductsClient } from "../client/ProductsClient";
import { getProductsServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";


export default async function ProductsSection() {
    const t = await getTranslations("our-products");
    const locale = await getLocale() as Language
    const products = await getProductsServer();

    const translations = {
        title: t("title"),
        btn: t("btn"),
    };

    return (
        <ProductsClient
            products={products}
            translations={translations}
            locale={locale}
        />
    );
}