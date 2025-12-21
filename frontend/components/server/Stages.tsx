import { MessageSquare } from "lucide-react";
import { getTranslations } from "next-intl/server";

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

    return (
        <section className="py-16 md:py-24 px-4 bg-linear-to-b from-white to-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                        {t("title")}
                    </h2>
                    <div className="space-y-3 md:space-y-4 max-w-3xl">
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            {t("subtitle1")}
                        </p>
                        <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                            {t("subtitle2")}
                        </p>
                    </div>
                </div>

                {/* Stages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {/* Stage 1 */}
                    <StageCard stage={stages[0]} />

                    {/* Stage 2 - Full width on desktop */}
                    <StageCard stage={stages[1]} />

                    {/* Stage 3 */}
                    <StageCard stage={stages[2]} />

                    {/* Stage 4 */}
                    <StageCard stage={stages[3]} />

                    {/* Stage 5 */}
                    <div className="md:col-span-2 lg:col-span-2">
                        <StageCard stage={stages[4]} />
                    </div>
                </div>
            </div>
        </section>
    );
}

function StageCard({ stage }: { stage: Stage }) {
    const baseClasses =
        "group relative overflow-hidden rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl h-full";
    const bgClasses = stage.isHighlighted
        ? "bg-cRed text-white hover:scale-[1.02]"
        : "bg-gray-100 text-gray-900 hover:bg-white hover:shadow-lg";

    return (
        <div className={`${baseClasses} ${bgClasses}`}>
            {/* Stage Badge */}
            <div className="flex items-center gap-3 mb-6">
                <div
                    className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl transition-all duration-300 ${
                        stage.isHighlighted
                            ? "bg-white/20 group-hover:bg-white/30"
                            : "bg-cRed group-hover:scale-110"
                    }`}
                >
                    <MessageSquare
                        className={`w-6 h-6 md:w-7 md:h-7 text-white`}
                    />
                </div>
                <div
                    className={`px-4 py-2 rounded-lg text-sm md:text-base font-semibold ${
                        stage.isHighlighted
                            ? "bg-white/20 text-white"
                            : "bg-gray-200 text-gray-700"
                    }`}
                >
                    {stage.number} этап
                </div>
            </div>

            {/* Content */}
            <div className="space-y-3 md:space-y-4">
                <h3
                    className={`text-xl md:text-2xl font-bold leading-tight ${
                        stage.isHighlighted ? "text-white" : "text-gray-900"
                    }`}
                >
                    {stage.title}
                </h3>
                <p
                    className={`text-sm md:text-base leading-relaxed ${
                        stage.isHighlighted ? "text-white/90" : "text-gray-600"
                    }`}
                >
                    {stage.description}
                </p>
            </div>

            {/* Decorative Element */}
            <div
                className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full opacity-10 transition-all duration-300 group-hover:scale-150 ${
                    stage.isHighlighted ? "bg-white" : "bg-cRed"
                }`}
            />
        </div>
    );
}
