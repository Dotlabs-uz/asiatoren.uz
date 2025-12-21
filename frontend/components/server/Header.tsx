"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface NavItem {
    label: string;
    href: string;
}

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations("header");
    const router = useRouter();
    const locale = useLocale();

    const pages: NavItem[] = [
        { href: "/products", label: t("nav.products") },
        { href: "/about", label: t("nav.about") },
        { href: "/contacts", label: t("nav.contacts") },
    ];

    const changeLanguage = (locale: string) => {
        document.cookie = `locale=${locale}; path=/;`;
        router.refresh();

        window.scrollTo({ top: 0 });
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <div className="flex items-center gap-3">
                            <Image
                                width={40}
                                height={40}
                                src={"/images/logo.svg"}
                                alt="logo"
                                loading="lazy"
                            />
                            <div className="hidden sm:block">
                                <div className="text-cRed font-bold text-xl tracking-tight">
                                    ASIA TAREN
                                </div>
                                <div className="text-cRed text-sm font-medium -mt-1">
                                    POULTRY
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {pages.map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="text-gray-700 hover:text-cRed transition-colors duration-200 text-sm font-medium relative group"
                            >
                                {item.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cRed transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </nav>

                    {/* Language & CTA */}
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex max-md:hidden gap-2">
                            <Button
                                variant={"link"}
                                onClick={() => changeLanguage("uz")}
                                className="p-0 cursor-pointer"
                            >
                                <span
                                    className={`${
                                        locale === "uz" &&
                                        "text-cRed transition-all"
                                    }`}
                                >
                                    UZB
                                </span>
                            </Button>
                            <Button
                                variant={"link"}
                                onClick={() => changeLanguage("ru")}
                                className="p-0 cursor-pointer"
                            >
                                <span
                                    className={`${
                                        locale === "ru" &&
                                        "text-cRed transition-all"
                                    }`}
                                >
                                    РУС
                                </span>
                            </Button>
                            <Button
                                variant={"link"}
                                onClick={() => changeLanguage("en")}
                                className="p-0 cursor-pointer"
                            >
                                <span
                                    className={`${
                                        locale === "en" &&
                                        "text-cRed transition-all"
                                    }`}
                                >
                                    ENG
                                </span>
                            </Button>
                        </div>
                        <Button className="bg-cRed hover:bg-cRed/80 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                            {t("btn")}
                        </Button>
                    </div>

                    {/* Mobile Menu - shadcn Sheet */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-white/50"
                            >
                                <Menu className="w-6 h-6 text-gray-700" />
                                <span className="sr-only">Открыть меню</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[300px] sm:w-[400px]"
                        >
                            <SheetHeader>
                                <SheetTitle className="text-left">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            width={40}
                                            height={40}
                                            src={"/images/logo.svg"}
                                            alt="logo"
                                            loading="lazy"
                                        />
                                        <div>
                                            <div className="text-cRed font-bold text-lg tracking-tight">
                                                ASIA TAREN
                                            </div>
                                            <div className="text-cRed text-xs font-medium -mt-1">
                                                POULTRY
                                            </div>
                                        </div>
                                    </div>
                                </SheetTitle>
                            </SheetHeader>

                            <nav className="flex flex-col gap-4 mt-8">
                                {pages.map((item) => (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-700 hover:text-cRed hover:bg-red-50 px-4 rounded-lg transition-all duration-200 text-base font-medium"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-8 px-4 pt-6 border-t space-y-4">
                                <div className="flex gap-2">
                                    <Button
                                        variant={"link"}
                                        onClick={() => changeLanguage("uz")}
                                        className="p-0 cursor-pointer"
                                    >
                                        <span
                                            className={`${
                                                locale === "uz" &&
                                                "text-cRed transition-all"
                                            }`}
                                        >
                                            UZB
                                        </span>
                                    </Button>
                                    <Button
                                        variant={"link"}
                                        onClick={() => changeLanguage("ru")}
                                        className="p-0 cursor-pointer"
                                    >
                                        <span
                                            className={`${
                                                locale === "ru" &&
                                                "text-cRed transition-all"
                                            }`}
                                        >
                                            РУС
                                        </span>
                                    </Button>
                                    <Button
                                        variant={"link"}
                                        onClick={() => changeLanguage("en")}
                                        className="p-0 cursor-pointer"
                                    >
                                        <span
                                            className={`${
                                                locale === "en" &&
                                                "text-cRed transition-all"
                                            }`}
                                        >
                                            ENG
                                        </span>
                                    </Button>
                                </div>
                                <Button className="w-full bg-cRed hover:bg-cRed/80 text-white py-6 rounded-lg font-medium shadow-lg">
                                    {t("btn")}
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
