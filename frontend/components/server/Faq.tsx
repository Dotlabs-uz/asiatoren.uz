import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowUpRight } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    faqs?: FAQItem[];
}

export const FAQSection = ({
    faqs = [
        {
            question: 'Что за помощь открытия фермы "Под ключ"?',
            answer: 'Мы специализируемся на разработке и производстве передового оборудования для птицефабрик, а также можем организовать ферму специально для вас "Под ключ"',
        },
        {
            question: 'Что за помощь открытия фермы "Под ключ"?',
            answer: "Мы предоставляем полный комплекс услуг по открытию птицефабрики, включая проектирование, поставку оборудования и запуск производства.",
        },
        {
            question: 'Что за помощь открытия фермы "Под ключ"?',
            answer: "Наша команда экспертов поможет вам на всех этапах создания фермы - от выбора локации до обучения персонала.",
        },
        {
            question: 'Что за помощь открытия фермы "Под ключ"?',
            answer: "Мы берем на себя все технические и организационные вопросы, чтобы ваш бизнес начал работать максимально эффективно.",
        },
    ],
}: FAQSectionProps) => {
    return (
        <section className="w-full py-12 md:py-20 px-5 sm:px-8 lg:px-16 bg-gray-50">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 md:mb-16">
                    {/* Label */}
                    <div className="lg:col-span-3">
                        <span className="text-base md:text-lg text-gray-500 font-medium">
                            Частые вопросы
                        </span>
                    </div>

                    {/* Title */}
                    <div className="lg:col-span-9">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cGray leading-tight">
                            Возникли вопросы
                            <br />
                            по проекту?
                        </h2>
                    </div>
                </div>

                {/* FAQ Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    {faqs.map((faq, idx) => (
                        <Accordion
                            key={idx}
                            type="single"
                            collapsible
                            className="w-full"
                        >
                            <AccordionItem
                                value={idx.toString()}
                                className="border-none bg-white rounded-2xl md:rounded-3xl overflow-hidden"
                            >
                                <AccordionTrigger className="px-6 md:px-8 py-6 md:py-8 hover:no-underline group transition-colors">
                                    <span className="text-base md:text-lg lg:text-xl font-bold text-left text-gray-900 pr-4">
                                        {faq.question}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 md:px-8 pb-6 md:pb-8 pt-0">
                                    <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))}
                </div>
            </div>
        </section>
    );
};
