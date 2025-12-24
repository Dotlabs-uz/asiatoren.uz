// components/AboutSection.tsx
import { getTranslations } from "next-intl/server";
import { AboutClient } from "../client/AboutClient";

export default async function AboutSection() {
    const t = await getTranslations("about-us");

    const translations = {
        subtitle: t("subtitle"),
        title: t.raw("title"),
        p1: t("p1"),
        p2: t("p2"),
        stats: [
            {
                number: t("stats.0.number"),
                label: t("stats.0.label"),
            },
            {
                number: t("stats.1.number"),
                label: t("stats.1.label"),
            },
            {
                number: t("stats.2.number"),
                label: t("stats.2.label"),
            },
            {
                number: t("stats.3.number"),
                label: t("stats.3.label"),
            },
        ],
    };

    return <AboutClient translations={translations} />;
}
