// components/client/HeaderClient.tsx
"use client";

import { useEffect, useState } from "react";
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
import { usePathname } from "next/navigation";
import Image from "next/image";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface NavItem {
    label: string;
    href: string;
}

interface HeaderClientProps {
    text: {
        pages: NavItem[];
        btn: string;
    };
}

export default function HeaderClient({ text }: HeaderClientProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (href: string) => {
        const currentPath = pathname.replace(/^\/(uz|ru|en)/, "") || "/";
        const navPath = href.replace(/^\/(uz|ru|en)/, "") || "/";
        return currentPath === navPath;
    };

    // Проверяем, находимся ли мы на динамической странице (детальная страница)
    const isDynamicPage = () => {
        const cleanPath = pathname.replace(/^\/(uz|ru|en)/, "");

        // Проверяем паттерны динамических страниц
        const dynamicPatterns = [
            /^\/products\/[^\/]+$/, // /products/[id]
            /^\/news\/[^\/]+$/, // /news/[id]
            /^\/projects\/[^\/]+$/, // /projects/[id]
            /^\/festivals\/[^\/]+$/, // /festivals/[id]
        ];

        return dynamicPatterns.some((pattern) => pattern.test(cleanPath));
    };

    // Определяем, когда показывать темный текст
    // Всегда темный на динамических страницах ИЛИ когда прокручено на обычных
    const useDarkText = isDynamicPage() || isScrolled;
    const useWhiteBackground = isDynamicPage() || isScrolled;

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                useWhiteBackground
                    ? "bg-white/5 backdrop-blur-md shadow-sm"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <div className="flex items-center gap-3">
                            <Image
                                width={40}
                                height={40}
                                src={"/images/logo.PNG"}
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
                    <nav className="hidden lg:flex items-center space-x-5">
                        {text.pages.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`${
                                        active
                                            ? "text-cRed"
                                            : useDarkText
                                              ? "text-gray-700 hover:text-cRed"
                                              : "text-white hover:text-white/80"
                                    } transition-colors duration-200 text-sm font-semibold relative group`}
                                >
                                    {item.label}
                                    <span
                                        className={`absolute -bottom-1 left-0 h-0.5 bg-cRed transition-all duration-300 ${
                                            active
                                                ? "w-full"
                                                : "w-0 group-hover:w-full"
                                        }`}
                                    />
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Language & CTA */}
                    <div className="hidden lg:flex items-center gap-4">
                        <LanguageSwitcher />
                        <Link href="/contacts">
                            <Button className="cursor-pointer bg-cRed hover:bg-cRed/90">
                                {text.btn}
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu */}
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild className="lg:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`${
                                    useDarkText
                                        ? "hover:bg-gray-100"
                                        : "hover:bg-white/20"
                                }`}
                            >
                                <Menu
                                    className={`w-6 h-6 ${
                                        useDarkText
                                            ? "text-gray-700"
                                            : "text-white"
                                    }`}
                                />
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
                                            src={"/images/logo.PNG"}
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
                                {text.pages.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`${
                                                active
                                                    ? "text-cRed bg-red-50"
                                                    : "text-gray-700 hover:text-cRed hover:bg-red-50"
                                            } px-4 py-2 rounded-lg transition-all duration-200 text-base font-medium`}
                                        >
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="mt-8 px-4 pt-6 border-t space-y-4">
                                <LanguageSwitcher />
                                <Link href="/contacts">
                                    <Button className="w-full cursor-pointer bg-cRed hover:bg-cRed/90">
                                        {text.btn}
                                    </Button>
                                </Link>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
