import NewPageClient from "@/components/client/NewPageClient";
import { getNewsByIdServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function NewsDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const newsItem = await getNewsByIdServer(id);
    const locale = (await getLocale()) as Language;

    if (!newsItem) {
        notFound();
    }

    return <NewPageClient newsItem={newsItem} locale={locale} />;
}
