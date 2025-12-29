import { ProductPageClient } from "@/components/client/ProductPage";
import { getCategoryServer, getProductServer } from "@/lib/firebase/server-api";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const t = await getTranslations("product-page");
    console.log(id);

    const product = await getProductServer(id);

    if (!product) {
        notFound();
    }

    const category = await getCategoryServer(product.categoryId);
    const categoryName = category?.title || "Категория";

    const translations = {
        home: t("breadcrumb.home"),
        catalog: t("breadcrumb.catalog"),
        requestButton: t("requestButton"),
        warranty: t("benefits.warranty.title"),
        warrantyText: t("benefits.warranty.text"),
        delivery: t("benefits.delivery.title"),
        deliveryText: t("benefits.delivery.text"),
        selection: t("benefits.selection.title"),
        selectionText: t("benefits.selection.text"),
        descriptionTitle: t("descriptionTitle"),
        characteristicsTitle: t("characteristicsTitle"),
        featuresTitle: t("featuresTitle"),
        notFound: t("notFound"),
        priceLabel: t("priceLabel"),
        currency: t("currency"),
    };

    return (
        <ProductPageClient
            product={product}
            categoryName={categoryName}
            translations={translations}
        />
    );
}
