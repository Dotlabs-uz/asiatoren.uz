import { getTranslations } from "next-intl/server";
import { ScrollMainClient } from "../client/ScrollMainClient";

export default async function ScrollMain() {
    const t = await getTranslations("scroll-section");

    const itemsData = t.raw("items") as Array<{
        type: "text" | "image" | "video";
        content?: string;
        src?: string;
        alt?: string;
        poster?: string;
    }>;

    return <ScrollMainClient items={itemsData} />;
}
