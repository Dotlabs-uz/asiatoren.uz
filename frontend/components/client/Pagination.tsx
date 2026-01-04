// components/Pagination.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    showInfo?: boolean;
    infoText?: {
        showing: string;
        of: string;
        items: string;
    };
    totalItems?: number;
    itemsPerPage?: number;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    showInfo = false,
    infoText,
    totalItems,
    itemsPerPage,
}: PaginationProps) => {
    // Генерация номеров страниц для отображения
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            // Показываем все страницы
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Умная пагинация с многоточием
            if (currentPage <= 3) {
                // Начало: 1 2 3 4 5 ... 10
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Конец: 1 ... 6 7 8 9 10
                pages.push(1);
                pages.push("...");
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Середина: 1 ... 4 5 6 ... 10
                pages.push(1);
                pages.push("...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...");
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const goToPrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col gap-4">
            {/* Info Text */}
            {showInfo && infoText && totalItems && itemsPerPage && (
                <div className="text-sm md:text-base text-gray-600 text-center">
                    {infoText.showing}{" "}
                    {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
                    {infoText.of} {totalItems} {infoText.items}
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Previous Button */}
                <Button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                    variant="outline"
                >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    <span className="hidden sm:inline">Previous</span>
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                    {getPageNumbers().map((page, index) => (
                        <div key={index}>
                            {page === "..." ? (
                                <span className="px-2 text-gray-400">...</span>
                            ) : (
                                <Button
                                    onClick={() => onPageChange(page as number)}
                                    className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                                        currentPage === page
                                            ? "bg-cRed text-white hover:bg-cRed/90"
                                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                                    variant="outline"
                                >
                                    {page}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Next Button */}
                <Button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                    variant="outline"
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div>
    );
};