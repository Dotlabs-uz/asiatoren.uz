import { AboutPageClient } from "@/components/client/AboutPage";
import {
    getCertificatesServer,
    getPartnersServer,
} from "@/lib/firebase/server-api";
import { getTranslations } from "next-intl/server";

export default async function AboutPage() {
    const t = await getTranslations("about-page");
    const t1 = await getTranslations("about-us");
    const certificates = await getCertificatesServer();
    const partners = await getPartnersServer();

    const aboutTranslations = {
        subtitle: t1("subtitle"),
        title: t1("title"),
        p1: t1("p1"),
        p2: t1("p2"),
        stats: [
            {
                number: t1("stats.0.number"),
                label: t1("stats.0.label"),
            },
            {
                number: t1("stats.1.number"),
                label: t1("stats.1.label"),
            },
            {
                number: t1("stats.2.number"),
                label: t1("stats.2.label"),
            },
            {
                number: t1("stats.3.number"),
                label: t1("stats.3.label"),
            },
        ],
    };

    const translations = {
        hero: {
            title: t("hero.title"),
            subtitle: t("hero.subtitle"),
        },
        sections: {
            aboutCompany: t("sections.aboutCompany"),
            equipment: {
                title: t("sections.equipment.title"),
                production: t("sections.equipment.production"),
                description: t("sections.equipment.description"),
            },
            stages: {
                subtitle: t("sections.stages.subtitle"),
                title: t("sections.stages.title"),
                clientTasks: t("sections.stages.clientTasks"),
                step1: {
                    title: t("sections.stages.step1.title"),
                    description: t("sections.stages.step1.description"),
                },
                step2: {
                    title: t("sections.stages.step2.title"),
                    description: t("sections.stages.step2.description"),
                },
                step3: {
                    title: t("sections.stages.step3.title"),
                    description: t("sections.stages.step3.description"),
                },
                step4: {
                    title: t("sections.stages.step4.title"),
                    description: t("sections.stages.step4.description"),
                },
            },
            certificates: {
                label: t("sections.certificates.label"),
                title: t("sections.certificates.title"),
                p1: t("sections.certificates.p1"),
                p2: t("sections.certificates.p2"),
            },
            partners: {
                label: t("sections.partners.label"),
                title: t("sections.partners.title"),
                p1: t("sections.partners.p1"),
                p2: t("sections.partners.p2"),
            },
        },
    };

    return (
        <AboutPageClient
            translations={translations}
            aboutSectionTranslations={aboutTranslations}
            certificates={certificates}
            partners={partners}
        />
    );
}
