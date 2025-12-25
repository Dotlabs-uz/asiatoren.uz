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
            message: string;
            agree: string;
            terms: string;
            privacy: string;
            submit: string;
            sending: string;
            successMessage: string;
            errorMessage: string;
            firstNameError: string;
            lastNameError: string;
            phoneError: string;
            messageError: string;
            agreeError: string;
        };
        contact: {
            phone: string;
            email: string;
            address: string;
            connectTitle: string;
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

            // Hero анимация
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

            // Форма и контакты
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
                ".contact-info",
                {
                    x: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                },
                "-=0.6"
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div
                ref={heroRef}
                className="relative bg-[url('/images/farm.png')] bg-cover bg-center bg-no-repeat w-full h-[50vh] flex flex-col items-center justify-center"
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
                    <ContactsPageForm translations={translations.form} />

                    {/* Right - Map & Info */}
                    <div className="contact-info flex flex-col gap-8">
                        {/* Map */}
                        <div className="bg-cRed rounded-3xl p-6 md:p-8 h-full flex flex-col">
                            {/* Google Map */}
                            <div className="bg-white rounded-2xl overflow-hidden mb-6 flex-1 min-h-[300px]">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.415479944409!2d69.24348087649344!3d41.31107899862142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb98!2sAlisher%20Navoi%20National%20Library%20of%20Uzbekistan!5e0!3m2!1sen!2s!4v1703512345678!5m2!1sen!2s"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, minHeight: "300px" }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full"
                                />
                            </div>

                            {/* Contact Info */}
                            <div className="space-y-4 text-white">
                                {/* Phone */}
                                <a
                                    href="tel:+998901234567"
                                    className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <span className="text-lg font-medium">
                                        {translations.contact.phone}
                                    </span>
                                </a>

                                {/* Email */}
                                <a
                                    href="mailto:contact@example.com"
                                    className="flex items-center gap-4 hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <span className="text-lg font-medium">
                                        {translations.contact.email}
                                    </span>
                                </a>

                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <span className="text-lg font-medium pt-2">
                                        {translations.contact.address}
                                    </span>
                                </div>

                                {/* Social Media */}
                                <div className="pt-4 border-t border-white/20">
                                    <p className="text-white/80 mb-4 text-sm">
                                        {translations.contact.connectTitle}
                                    </p>
                                    <div className="flex gap-3">
                                        <a
                                            href="https://www.instagram.com/asiatarenuz?igsh=aWpwZjJ5eG9pbmE2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                        >
                                            <Instagram className="w-5 h-5 text-cRed" />
                                        </a>
                                        <a
                                            href="https://facebook.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                        >
                                            <Facebook className="w-5 h-5 text-cRed" />
                                        </a>
                                        <a
                                            href="https://twitter.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                        >
                                            <Twitter className="w-5 h-5 text-cRed" />
                                        </a>
                                        <a
                                            href="https://youtube.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                                        >
                                            <Youtube className="w-5 h-5 text-cRed" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
