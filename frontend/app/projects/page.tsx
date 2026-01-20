import ProjectsPageClient from "@/components/client/ProjectsPageClient";
import {
    getMediaSectionBySectionId,
    getProjectsServer,
} from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function ProjectsPage() {
    const t = await getTranslations("projects-page");
    const [projects, heroMediaArray] = await Promise.all([
        getProjectsServer(),
        getMediaSectionBySectionId("projects-banner"),
    ]);
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
        btn: t("btn"),
    };

    const heroMedia = heroMediaArray.length > 0 ? heroMediaArray[0] : null;

    return (
        <div>
            <ProjectsPageClient
                translations={translations}
                projects={projects}
                locale={locale}
                heroMedia={heroMedia}
            />
        </div>
    );
}
