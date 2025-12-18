import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function Home() {
    const t = useTranslations("hero");
    return (
        <div>
            <h1>{t("title")}</h1>
            <p>{t("subtitle")}</p>
            <Button variant={"outline"}>{t("cta")}</Button>
        </div>
    );
}
