import ProjectPageClient from "@/components/client/ProjectPageClient";
import { getProjectByIdServer } from "@/lib/firebase/server-api";
import { Language } from "@/types";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function ProjectPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = await getProjectByIdServer(id);
    const locale = (await getLocale()) as Language;

    if (!project) {
        notFound();
    }

    return (
        <div>
            <ProjectPageClient project={project} locale={locale} />
        </div>
    );
}
