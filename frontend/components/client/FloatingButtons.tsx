"use client";

import { useEffect, useState } from "react";
import { Phone, MessageCircle, ChevronUp } from "lucide-react";

export default function FloatingButtons() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            className={`fixed bottom-2 right-2 md:bottom-6 md:right-6 z-50 flex flex-col gap-3 transition-all duration-500 opacity-100`}
        >
            {/* Scroll to Top */}
            <button
                onClick={scrollToTop}
                className="size-10 md:size-14 rounded-md bg-linear-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white shadow-lg hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Scroll to top"
            >
                <ChevronUp className="size-4 md:size-6 group-hover:animate-bounce" />
            </button>

            {/* Phone */}
            <a
                href="tel:+998772013131"
                className="size-10 md:size-14 rounded-md bg-linear-to-br from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white shadow-lg hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="Call us"
            >
                <Phone className="size-4 md:size-6 group-hover:rotate-12 transition-transform duration-300" />
            </a>

            {/* WhatsApp */}
            <a
                href="https://chat.whatsapp.com/BZrNTimdKr09LySnKD6tYZ"
                target="_blank"
                rel="noopener noreferrer"
                className="size-10 md:size-14 rounded-md bg-linear-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white shadow-lg hover:shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                aria-label="WhatsApp"
            >
                <MessageCircle className="size-4 md:size-6 group-hover:rotate-12 transition-transform duration-300" />
            </a>
        </div>
    );
}
