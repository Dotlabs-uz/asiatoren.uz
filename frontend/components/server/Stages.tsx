// components/StagesSection.tsx
import { getTranslations } from "next-intl/server";
import { StagesClient } from "../client/StagesClient";

interface Stage {
    number: number;
    title: string;
    description: string;
    isHighlighted?: boolean;
}

export default async function StagesSection() {
    const t = await getTranslations("stages");

    const stages: Stage[] = [
        {
            number: 1,
            title: t("stage1.title"),
            description: t("stage1.description"),
        },
        {
            number: 2,
            title: t("stage2.title"),
            description: t("stage2.description"),
            isHighlighted: true,
        },
        {
            number: 3,
            title: t("stage3.title"),
            description: t("stage3.description"),
        },
        {
            number: 4,
            title: t("stage4.title"),
            description: t("stage4.description"),
        },
        {
            number: 5,
            title: t("stage5.title"),
            description: t("stage5.description"),
        },
    ];

    const translations = {
        title: t("title"),
        subtitle1: t("subtitle1"),
        subtitle2: t("subtitle2"),
        stageLabel: t("stageLabel"),
    };

    return <StagesClient stages={stages} translations={translations} />;
}