// app/sitemap.xml/route.ts
import { getProducts } from "@/lib/firebase/public-api";
import { Product } from "@/types";

const locales = ["ru", "uz", "en"];
const baseUrl = "https://www.asiataren.uz";

export async function GET() {
    const staticPages = ["", "/about-us", "/contacts", "/products"];
    const products: Product[] = await getProducts();

    const urls: string[] = [];

    // Статические страницы
    for (const page of staticPages) {
        const priority = page === "" ? "1.0" : "0.8";
        urls.push(`
    <url>
        <loc>${baseUrl}${page}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${priority}</priority>
        ${locales
            .map(
                (locale) => `
        <xhtml:link 
            rel="alternate"
            hreflang="${locale}"
            href="${baseUrl}${page}${
                    page.includes("?") ? "&" : "?"
                }lang=${locale}"/>
        `
            )
            .join("")}
    </url>`);
    }

    // Динамические страницы продуктов
    for (const product of products) {
        urls.push(`
    <url>
        <loc>${baseUrl}/products/${product.id}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.6</priority>
        ${locales
            .map(
                (locale) => `
        <xhtml:link 
            rel="alternate"
            hreflang="${locale}"
            href="${baseUrl}/products/${product.id}?lang=${locale}"/>
        `
            )
            .join("")}
    </url>`);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml">
    ${urls.join("")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
