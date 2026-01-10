import { getProducts } from "@/lib/firebase/public-api";
import { Product } from "@/types";
import { MetadataRoute } from "next";

const locales = ["ru", "uz", "en"];
const baseUrl = "https://www.asiataren.uz";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const routes: MetadataRoute.Sitemap = [];

    // Статические страницы
    const staticPages = ["", "/about-us", "/contacts", "/products"];

    for (const page of staticPages) {
        routes.push({
            url: `${baseUrl}${page}`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: page === "" ? 1 : 0.8,
            alternates: {
                languages: Object.fromEntries(
                    locales.map((locale) => [
                        locale,
                        `${baseUrl}${page}${
                            page.includes("?") ? "&" : "?"
                        }lang=${locale}`,
                    ])
                ),
            },
        });
    }

    // Динамические страницы продуктов
    const products: Product[] = await getProducts();

    for (const product of products) {
        routes.push({
            url: `${baseUrl}/products/${product.id}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.6,
            alternates: {
                languages: Object.fromEntries(
                    locales.map((locale) => [
                        locale,
                        `${baseUrl}/products/${product.id}?lang=${locale}`,
                    ])
                ),
            },
        });
    }

    return routes;
}
