import { getTranslations } from "next-intl/server";
import { FAQClient } from "../client/FaqClient";

export default async function FAQSection() {
    const t = await getTranslations("faq");

    // Получаем массив FAQ из переводов
    const faqsData = t.raw("accordion") as Array<{
        question: string;
        answer: string;
    }>;

    const translations = {
        subtitle: t("subtitle"),
        title: t.raw("title"),
    };

    return <FAQClient faqs={faqsData} translations={translations} />;
}
