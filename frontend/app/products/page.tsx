import { getLocale, getTranslations } from "next-intl/server";
import { CatalogClient } from "@/components/client/Catalog";
import {
    getCategoriesServer,
    getProductsServer,
} from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "products" });

    return {
        title: t("title"),
        description: t("description"),
        keywords: [
            "каталог оборудования для птицеводства",
            "оборудование для птицефабрик купить",
            "системы кормления птицы",
            "системы поения птицы",
            "вентиляция для птичников",
            "Asia Toren каталог",
        ],
        alternates: {
            canonical: "https://asiatoren.uz/products",
            languages: {
                ru: "https://asiatoren.uz/products?lang=ru",
                uz: "https://asiatoren.uz/products?lang=uz",
                en: "https://asiatoren.uz/products?lang=en",
            },
        },
        openGraph: {
            type: "website",
            locale: locale,
            url: "https://asiatoren.uz/products",
            siteName: "Asia Toren",
            title: t("title"),
            description: t("description"),
            images: [
                {
                    url: "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: "Каталог оборудования Asia Toren",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            images: ["/og-image.png"],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-image-preview": "large",
            },
        },
        authors: [{ name: "Asia Toren" }],
    };
}

// ============ КОМПОНЕНТ СТРАНИЦЫ ============
export default async function CatalogPage() {
    const t = await getTranslations("catalog");
    const products = await getProductsServer();
    const categories = await getCategoriesServer();
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
        searchPlaceholder: t("searchPlaceholder"),
        all: t("all"),
        viewButton: t("viewButton"),
        notFound: t("notFound"),
        tryAgain: t("tryAgain"),
        showing: t("showing"),
        of: t("of"),
        products: t("items"),
    };

    // ============ JSON-LD СТРУКТУРИРОВАННЫЕ ДАННЫЕ ============

    // CollectionPage Schema - для страницы каталога
    const jsonLdCollectionPage = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: t("title"),
        description: t("searchPlaceholder"),
        url: "https://asiatoren.uz/products",
        inLanguage: locale,
    };

    // ItemList Schema - список всех продуктов
    const jsonLdItemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Каталог продуктов Asia Toren",
        description: "Полный каталог оборудования для птицеводства",
        numberOfItems: products.length,
        itemListElement: products.slice(0, 20).map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "Product",
                name: product.title?.[locale] || product.title?.ru,
                description:
                    product.description?.[locale] || product.description?.ru,
                image: product.images?.[0],
                url: `https://asiatoren.uz/products/${product.id}`,
                ...(product.price && {
                    offers: {
                        "@type": "Offer",
                        price: product.price,
                        priceCurrency: "UZS",
                        availability: "https://schema.org/InStock",
                    },
                }),
            },
        })),
    };

    // BreadcrumbList Schema - хлебные крошки
    const jsonLdBreadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: "https://asiatoren.uz",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: t("title"),
                item: "https://asiatoren.uz/products",
            },
        ],
    };

    // Если у вас есть категории, добавьте их
    const jsonLdCategories =
        categories.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "ItemList",
                  name: "Категории продуктов",
                  itemListElement: categories.map((category, index) => ({
                      "@type": "ListItem",
                      position: index + 1,
                      item: {
                          "@type": "Thing",
                          name: category.title?.[locale] || category.title?.ru,
                          url: `https://asiatoren.uz/products?category=${category.id}`,
                      },
                  })),
              }
            : null;

    return (
        <>
            {/* ============ СТРУКТУРИРОВАННЫЕ ДАННЫЕ ============ */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdCollectionPage),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdItemList),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLdBreadcrumb),
                }}
            />
            {jsonLdCategories && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLdCategories),
                    }}
                />
            )}
            <CatalogClient
                initialCategories={categories}
                initialProducts={products}
                translations={translations}
                locale={locale}
            />
        </>
    );
}
