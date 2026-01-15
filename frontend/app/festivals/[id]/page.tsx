import FestivalPageClient from "@/components/client/FestivalPageClient";
import { getFestivalByIdServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function FestivalDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const festival = await getFestivalByIdServer(id);
    const locale = (await getLocale()) as Language;

    if (!festival) {
        notFound();
    }

    return <FestivalPageClient festival={festival} locale={locale} />;
}
