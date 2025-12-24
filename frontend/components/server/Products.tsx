import { getTranslations } from "next-intl/server";
import { ProductsClient } from "../client/ProductsClient";
import { getCategoriesServer, getProductsServer } from "@/lib/firebase/server-api";


export default async function ProductsSection() {
    const t = await getTranslations("our-products");
    const products = await getProductsServer();
    const categories = await getCategoriesServer();

    const translations = {
        title: t("title"),
        btn: t("btn"),
    };

    return (
        <ProductsClient
            categories={categories}
            products={products}
            translations={translations}
        />
    );
}