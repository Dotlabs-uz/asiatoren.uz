import { getTranslations, getLocale } from "next-intl/server";
import { FAQClient } from "../client/FaqClient";

export default async function FAQSection() {
    const t = await getTranslations("faq");
    const locale = await getLocale();

    const faqsData = t.raw("accordion") as Array<{
        question: string;
        answer: string;
    }>;

    const translations = {
        subtitle: t("subtitle"),
        title: t.raw("title"),
    };

    const faqStructuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqsData.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
        inLanguage: locale,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(faqStructuredData),
                }}
            />

            <FAQClient faqs={faqsData} translations={translations} />
        </>
    );
}
