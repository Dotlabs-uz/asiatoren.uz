import Image from "next/image";

interface AboutSectionProps {
    stats?: {
        clients: string;
        systems: string;
        factories: string;
        partners: string;
    };
}

export const AboutSection = ({
    stats = {
        clients: "99%",
        systems: "8000+",
        factories: "50+",
        partners: "100+",
    },
}: AboutSectionProps) => {
    return (
        <section className="w-full py-12 md:py-20 px-5 sm:px-8 lg:px-16 bg-white">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 md:mb-16">
                    {/* Label */}
                    <div className="lg:col-span-1">
                        <span className="text-base md:text-lg text-gray-500 font-medium">
                            О нас
                        </span>
                    </div>

                    {/* Title */}
                    <div className="lg:col-span-2">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                            О нашей
                            <br />
                            компании
                        </h2>
                    </div>

                    {/* Description */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            Мы специализируемся на разработке и производстве
                            передового оборудования для птицефабрик.
                        </p>
                        <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                            Наша миссия – предоставлять инновационные и надежные
                            решения, которые повышают эффективность и
                            рентабельность вашего бизнеса.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12 md:mb-16">
                    <div className="flex flex-col gap-2">
                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cRed">
                            {stats.clients}
                        </span>
                        <span className="text-sm md:text-base text-gray-600">
                            Довольных клиентов
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cRed">
                            {stats.systems}
                        </span>
                        <span className="text-sm md:text-base text-gray-600">
                            Установленных систем
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cRed">
                            {stats.factories}
                        </span>
                        <span className="text-sm md:text-base text-gray-600">
                            Организованных фабрик
                            <br className="hidden md:block" />в Центральной Азии
                        </span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-cRed">
                            {stats.partners}
                        </span>
                        <span className="text-sm md:text-base text-gray-600">
                            Партнёров
                        </span>
                    </div>
                </div>

                {/* Map */}
                <div className="w-full aspect-video lg:aspect-21/9 rounded-2xl md:rounded-3xl overflow-hidden bg-gray-100">
                    <Image
                        src="/images/map.png"
                        alt="World Map"
                        width={5000}
                        height={5000}
                        loading="lazy"
                        className="w-full h-full object-contain bg-white"
                    />
                </div>
            </div>
        </section>
    );
};
