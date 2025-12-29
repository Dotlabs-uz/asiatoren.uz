import React from "react";
import { MultilingualText, Language } from "@/types";

interface MultilingualInputProps {
    label: string;
    value: MultilingualText;
    onChange: (value: MultilingualText) => void;
    type?: "text" | "textarea";
    required?: boolean;
    placeholder?: {
        ru?: string;
        en?: string;
        uz?: string;
    };
}

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
];

export const MultilingualInput: React.FC<MultilingualInputProps> = ({
    label,
    value,
    onChange,
    type = "text",
    required = false,
    placeholder = {},
}) => {
    const handleChange = (lang: Language, newValue: string) => {
        onChange({
            ...value,
            [lang]: newValue,
        });
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="space-y-3">
                {LANGUAGES.map((lang) => (
                    <div key={lang.code} className="relative">
                        <div className="flex items-center mb-1">
                            <span className="text-lg mr-2">{lang.flag}</span>
                            <span className="text-sm text-gray-600">
                                {lang.name}
                            </span>
                        </div>

                        {type === "textarea" ? (
                            <textarea
                                value={value[lang.code]}
                                onChange={(e) =>
                                    handleChange(lang.code, e.target.value)
                                }
                                placeholder={
                                    placeholder[lang.code] ||
                                    `${label} (${lang.name})`
                                }
                                required={required}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        ) : (
                            <input
                                type="text"
                                value={value[lang.code]}
                                onChange={(e) =>
                                    handleChange(lang.code, e.target.value)
                                }
                                placeholder={
                                    placeholder[lang.code] ||
                                    `${label} (${lang.name})`
                                }
                                required={required}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
