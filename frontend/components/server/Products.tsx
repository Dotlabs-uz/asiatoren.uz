import { ArrowRight } from "lucide-react";
import { Category, Product } from "@/types";
import { Button } from "../ui/button";

interface ProductsSectionProps {
    categories: Category[];
    products: Product[];
}

export const ProductsSection = ({
    categories,
    products,
}: ProductsSectionProps) => {
    return (
        <section className="w-full py-12 md:py-20 px-5 sm:px-8 lg:px-16 bg-white">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center lg:items-center gap-8 mb-8 md:mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-cGray">
                        Наши товары
                    </h2>

                    <Button className="group flex items-center gap-3 px-8 md:px-10 py-4 md:py-5 w-full md:w-60 justify-center transition-all duration-300">
                        Открыть каталог
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>

                {/* Categories Horizontal Scroll */}
                <div className="mb-8 md:mb-12">
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        {categories.map((category) => (
                            <Button variant={"default"}
                                key={category.id}
                                className={`whitespace-nowrap  transition-all duration-500 px-6 py-3 rounded-xl font-semibold text-lg bg-gray-100 text-gray-600 hover:bg-cRed hover:text-white
                                `}
                            >
                                {category.title}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                    {products.map((product) => {
                        return (
                            <button
                                key={product.id}
                                className="group relative overflow-hidden rounded-xl md:rounded-2xl transition-all duration-500 hover:scale-[1.02] bg-gray-100 text-gray-900 hover:bg-cRed"
                            >
                                {/* Card Content */}
                                <div className="relative z-10 p-4 md:p-6 flex flex-col justify-between min-h-[280px] md:min-h-80">
                                    {/* Product Image */}
                                    {product.images?.[0] && (
                                        <div className="flex-1 flex items-center justify-center mb-4">
                                            <img
                                                src={product.images[0]}
                                                alt={product.title}
                                                className="w-full h-32 md:h-40 object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    )}

                                    {/* Product Name */}
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="text-base md:text-lg lg:text-xl font-bold text-left line-clamp-2 text-gray-900 group-hover:text-white transition-colors duration-300">
                                            {product.title}
                                        </h3>
                                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6 shrink-0 group-hover:translate-x-2 transition-transform duration-300 text-gray-900 group-hover:text-white" />
                                    </div>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-cRed to-cRed/80" />
                            </button>
                        );
                    })}
                </div>

                {/* Empty State */}
                {products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">
                            В этой категории пока нет продуктов
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};