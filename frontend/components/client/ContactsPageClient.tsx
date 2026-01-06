// components/client/ContactsPageClient.tsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
    Phone,
    Mail,
    MapPin,
    Instagram,
    Facebook,
    Twitter,
    Youtube,
    Send,
} from "lucide-react";
import { ContactsPageForm } from "./ContactsPageForm";

interface ContactsPageClientProps {
    translations: {
        hero: {
            title: string;
            subtitle: string;
        };
        form: {
            title: string;
            firstName: string;
            lastName: string;
            phone: string;
            email: string;
            message: string;
            submit: string;
            sending: string;
            successMessage: string;
            errorMessage: string;
            firstNameError: string;
            lastNameError: string;
            phoneError: string;
            emailError: string;
            messageError: string;
        };
        contact: {
            phone1: string;
            phone2: string;
            email: string;
            address1: {
                title: string;
                address: string;
                mapUrl: string;
            };
            address2: {
                title: string;
                address: string;
                mapUrl: string;
            };
            connectTitle: string;
            socialTitle: string;
        };
    };
}

export default function ContactsPageClient({
    translations,
}: ContactsPageClientProps) {
    const heroRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(".hero-title", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            });

            tl.from(
                ".hero-subtitle",
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.5"
            );

            tl.from(
                ".contact-form",
                {
                    x: -50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.3"
            );

            tl.from(
                ".location-card",
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                },
                "-=0.6"
            );

            tl.from(
                ".contact-footer",
                {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.3"
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div
                ref={heroRef}
                className="relative bg-[url('/images/farm.webp')] bg-cover bg-center bg-no-repeat w-full h-[50vh] flex flex-col items-center justify-center"
            >
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative z-10 text-center px-4">
                    <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white font-bold mb-4">
                        {translations.hero.title}
                    </h1>
                    <p className="hero-subtitle text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto">
                        {translations.hero.subtitle}
                    </p>
                </div>
            </div>

            {/* Contact Section */}
            <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left - Form */}
                    <div className="lg:sticky lg:top-20 lg:self-start">
                        <ContactsPageForm translations={translations.form} />
                    </div>

                    {/* Right - Locations */}
                    <div className="flex flex-col gap-8">
                        {/* Location 1 */}
                        <div className="location-card bg-gray-100 rounded-3xl p-6 md:p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {translations.contact.address1.title}
                            </h3>

                            {/* Map 1 */}
                            <div className="bg-white rounded-2xl overflow-hidden mb-6 h-[300px]">
                                <iframe
                                    src={translations.contact.address1.mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                />
                            </div>

                            {/* Address 1 */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cRed/10 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-cRed" />
                                </div>
                                <p className="text-lg text-gray-700 pt-2">
                                    {translations.contact.address1.address}
                                </p>
                            </div>
                        </div>

                        {/* Location 2 */}
                        <div className="location-card bg-gray-100 rounded-3xl p-6 md:p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {translations.contact.address2.title}
                            </h3>

                            {/* Map 2 */}
                            <div className="bg-white rounded-2xl overflow-hidden mb-6 h-[300px]">
                                <iframe
                                    src={translations.contact.address2.mapUrl}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                />
                            </div>

                            {/* Address 2 */}
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cRed/10 rounded-xl flex items-center justify-center shrink-0">
                                    <MapPin className="w-6 h-6 text-cRed" />
                                </div>
                                <p className="text-lg text-gray-700 pt-2">
                                    {translations.contact.address2.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Width Contact Footer */}
            <div className="contact-footer bg-cRed py-12 md:py-16">
                <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
                        {/* Phone */}
                        <a
                            href={`tel:${translations.contact.phone1.replace(
                                /\s/g,
                                ""
                            )}`}
                            className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Phone className="w-8 h-8 text-cRed" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm mb-1">
                                    {translations.contact.connectTitle}
                                </p>
                                <span className="text-white text-xl font-semibold">
                                    {translations.contact.phone1}
                                </span>
                            </div>
                        </a>

                        <a
                            href={`tel:${translations.contact.phone2.replace(
                                /\s/g,
                                ""
                            )}`}
                            className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Phone className="w-8 h-8 text-cRed" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm mb-1">
                                    {translations.contact.connectTitle}
                                </p>
                                <span className="text-white text-xl font-semibold">
                                    {translations.contact.phone2}
                                </span>
                            </div>
                        </a>

                        {/* Email */}
                        <a
                            href={`mailto:${translations.contact.email}`}
                            className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Mail className="w-8 h-8 text-cRed" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm mb-1">
                                    Email
                                </p>
                                <span className="text-white text-xl font-semibold">
                                    {translations.contact.email}
                                </span>
                            </div>
                        </a>

                        {/* Social Media */}
                        <div className="col-span-full flex flex-col md:justify-start md:items-start">
                            <p className="text-white/80 mb-4 text-sm">
                                {translations.contact.socialTitle}
                            </p>
                            <div className="flex gap-3">
                                <a
                                    href="https://www.instagram.com/asiatarenuz?igsh=aWpwZjJ5eG9pbmE2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                    aria-label="Instagram"
                                >
                                    <Instagram className="w-6 h-6 text-cRed" />
                                </a>
                                <a
                                    href="https://t.me/Asia_Taren_Poultry"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                    aria-label="Telegram"
                                >
                                    <Send className="w-6 h-6 text-cRed" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
