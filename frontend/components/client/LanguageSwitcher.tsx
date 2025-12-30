"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface Language {
    code: string;
    name: string;
    flag: string;
}

const languages: Language[] = [
    {
        code: "uz",
        name: "Uzb",
        flag: "🇺🇿",
    },
    {
        code: "ru",
        name: "Рус",
        flag: "🇷🇺",
    },
    {
        code: "en",
        name: "Eng",
        flag: "🇬🇧",
    },
];

export const LanguageSwitcher = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const locale = useLocale();

    const currentLanguage = languages.find((lang) => lang.code === locale);

    const changeLanguage = (newLocale: string) => {
        document.cookie = `locale=${newLocale}; path=/;`;
        setOpen(false);
        router.refresh();
        window.scrollTo({ top: 0 });
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2 bg-white/50 hover:bg-white/60 border-white/30 hover:border-white/50 transition-all duration-100 cursor-pointer"
                >
                    <span className="text-2xl">{currentLanguage?.flag}</span>
                    <span className="font-medium text-gray-700">
                        {currentLanguage?.name}
                    </span>
                    {/* <ChevronDown className="w-4 h-4 text-gray-500" /> */}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="end"
                className="w-32 p-2 bg-white border border-gray-200 shadow-lg rounded-xl"
            >
                <div className="space-y-1">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => changeLanguage(language.code)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-gray-100 ${
                                locale === language.code
                                    ? "bg-red-50 text-cRed"
                                    : "text-gray-700"
                            }`}
                        >
                            <span className="text-2xl">{language.flag}</span>
                            <span className="font-medium text-sm">
                                {language.name}
                            </span>
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
};
