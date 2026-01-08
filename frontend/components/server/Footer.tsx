import Link from "next/link";
import { Instagram, Send, Phone, MessageCircle } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Footer() {
    const t = await getTranslations("footer");

    const navigation = [
        { label: t("nav.products"), href: "/products" },
        { label: t("nav.about"), href: "/about-us" },
        { label: t("nav.contacts"), href: "/contacts" },
    ];

    const socialLinks = [
        {
            label: "Instagram",
            href: "https://www.instagram.com/asiatarenuz?igsh=aWpwZjJ5eG9pbmE2",
            icon: <Instagram className="w-5 h-5" />,
        },
        {
            label: "Telegram",
            href: "https://t.me/Asia_Taren_Poultry",
            icon: <Send className="w-5 h-5" />,
        },
    ];

    const contact = {
        phone: "+998 77 201 31 31",
        tg: "@Asiatarenpoultry1",
    };

    return (
        <footer className="w-full bg-linear-to-b from-gray-900 to-black text-white">
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">
                {/* Main Footer Content */}
                <div className="py-12 md:py-16 lg:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {/* Logo & Company Name */}
                        <div className="flex flex-col gap-6">
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
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-col gap-4">
                            <Link
                                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                                className="flex items-center gap-3 group"
                            >
                                <Phone className="w-6 h-6 text-gray-400 group-hover:text-cRed transition-colors" />
                                <span className="text-lg md:text-xl lg:text-2xl font-bold group-hover:text-cRed transition-colors">
                                    {contact.phone}
                                </span>
                            </Link>
                            <Link
                                href={`https://t.me/${contact.tg.replace(
                                    /@/,
                                    ""
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 group"
                            >
                                <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-cRed transition-colors" />
                                <span className="text-lg md:text-xl font-medium text-gray-300 group-hover:text-cRed transition-colors">
                                    {contact.tg}
                                </span>
                            </Link>
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg md:text-xl font-bold mb-2">
                                {t("nav.title")}
                            </h3>
                            <nav className="flex flex-col gap-3">
                                {navigation.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="text-base md:text-lg text-gray-300 hover:text-white hover:translate-x-1 transition-all"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Social Links */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-lg md:text-xl font-bold mb-2">
                                {t("socials")}
                            </h3>
                            <nav className="flex flex-col gap-3">
                                {socialLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 text-base md:text-lg text-gray-300 hover:text-white group transition-colors"
                                    >
                                        <span className="group-hover:translate-x-1 transition-transform">
                                            {link.icon}
                                        </span>
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm md:text-base text-gray-400">
                            Asia Taren Poultry
                        </p>
                        <p className="text-sm md:text-base text-gray-400">
                            2014
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
