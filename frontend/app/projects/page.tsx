import ProjectsPageClient from "@/components/client/ProjectsPageClient";
import { getProjectsServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale, getTranslations } from "next-intl/server";

export default async function ProjectsPage() {
    const t = await getTranslations("projects-page");
    const projects = await getProjectsServer();
    const locale = (await getLocale()) as Language;

    const translations = {
        title: t("title"),
        btn: t("btn"),
    };
    return (
        <div>
            <ProjectsPageClient
                translations={translations}
                projects={projects}
                locale={locale}
            />
        </div>
    );
}
