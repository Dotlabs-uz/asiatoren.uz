import React from "react";
import { MultilingualText, Language } from "@/types";
import { X, Plus } from "lucide-react";

interface MultilingualArrayInputProps {
    label: string;
    value: MultilingualText[];
    onChange: (value: MultilingualText[]) => void;
    placeholder?: string;
}

const LANGUAGES: { code: Language; name: string; flag: string }[] = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "uz", name: "O'zbek", flag: "🇺🇿" },
];

export const MultilingualArrayInput: React.FC<MultilingualArrayInputProps> = ({
    label,
    value,
    onChange,
    placeholder = "Введите текст",
}) => {
    const addItem = () => {
        onChange([...value, { ru: "", en: "", uz: "" }]);
    };

    const removeItem = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, lang: Language, text: string) => {
        const newValue = [...value];
        newValue[index] = {
            ...newValue[index],
            [lang]: text,
        };
        onChange(newValue);
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>

            <div className="space-y-4">
                {value.map((item, index) => (
                    <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Пункт {index + 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {LANGUAGES.map((lang) => (
                            <div key={lang.code}>
                                <div className="flex items-center mb-1">
                                    <span className="text-lg mr-2">
                                        {lang.flag}
                                    </span>
                                    <span className="text-xs text-gray-600">
                                        {lang.name}
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={item[lang.code]}
                                    onChange={(e) =>
                                        updateItem(
                                            index,
                                            lang.code,
                                            e.target.value
                                        )
                                    }
                                    placeholder={`${placeholder} (${lang.name})`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
                <Plus className="w-4 h-4" />
                Добавить пункт
            </button>
        </div>
    );
};
