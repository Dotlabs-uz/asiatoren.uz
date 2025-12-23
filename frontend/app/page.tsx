import { AboutSection } from "@/components/server/About";
import Header from "@/components/server/Header";
import { ProductsSection } from "@/components/server/Products";
import StagesSection from "@/components/server/Stages";
import { Button } from "@/components/ui/button";
import {
    getCategoriesServer,
    getProductsServer,
} from "@/lib/firebase/server-api";
import { getTranslations } from "next-intl/server";

export default async function Home() {
    const t = await getTranslations();
    const products = await getProductsServer();
    const categories = await getCategoriesServer();

    return (
        <div>
            <Header />

            {/* Hero section */}
            <div className="w-full h-screen bg-[url('/images/hero-bg.png')] bg-cover bg-center relative">
                <div className="w-full lg:w-[40%] md:w-[50%] h-screen flex flex-col justify-end items-start gap-8 md:gap-12 lg:gap-20 px-5 sm:px-8 md:mx-10 pb-8 md:pb-12">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-bold">
                        Технологии для лучших условий
                    </h1>
                    <div className="flex flex-col justify-start items-start gap-4 md:gap-6 lg:gap-8">
                        <p className="text-base sm:text-lg md:text-xl text-white font-medium max-w-2xl">
                            Полный комплекс решений для птицефабрик — от
                            вентиляции до автоматических систем кормления.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-start items-stretch sm:items-start gap-3 w-full sm:w-auto">
                            <Button
                                className="w-full sm:w-52 md:w-60 px-6 sm:px-8 md:px-10 py-4 md:py-5 text-sm md:text-base"
                                variant={"custom"}
                            >
                                Получить консультацию
                            </Button>
                            <Button className="w-full sm:w-52 md:w-60 px-6 sm:px-8 md:px-10 py-4 md:py-5 text-sm md:text-base bg-transparent hover:bg-transparent/80 border border-white">
                                Скачать каталог
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stages section */}
            <StagesSection />

            {/* Products */}
            <ProductsSection products={products} categories={categories} />

            {/* About Us */}
            <AboutSection />
        </div>
    );
}
