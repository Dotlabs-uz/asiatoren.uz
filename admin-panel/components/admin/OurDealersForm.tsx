"use client";

import { useState } from "react";
import { DealerFormData, DealerAddress } from "@/types";
import { MultilingualInput } from "@/components/admin/MultilingualInput";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ImagePlus, Loader2 } from "lucide-react";
import Image from "next/image";
import { uploadFile } from "@/lib/firebase/storage";

export default function DealerForm({ initialData, onSubmit, onCancel }: any) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<DealerFormData>({
        title: initialData?.title || { ru: "", en: "", uz: "" },
        logoUrl: initialData?.logoUrl || "",
        addresses: initialData?.addresses || [
            { title: "", phoneNumbers: "", email: "", map: "", website: "" },
        ],
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleAddAddress = () => {
        setFormData({
            ...formData,
            addresses: [
                ...formData.addresses,
                {
                    title: "",
                    phoneNumbers: "",
                    email: "",
                    map: "",
                    website: "",
                },
            ],
        });
    };

    const handleRemoveAddress = (index: number) => {
        const newAddresses = formData.addresses.filter((_, i) => i !== index);
        setFormData({ ...formData, addresses: newAddresses });
    };

    const handleAddressChange = (
        index: number,
        field: keyof DealerAddress,
        value: string
    ) => {
        const newAddresses = [...formData.addresses];
        newAddresses[index] = { ...newAddresses[index], [field]: value };
        setFormData({ ...formData, addresses: newAddresses });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let finalLogoUrl = formData.logoUrl;
            if (logoFile) {
                finalLogoUrl = await uploadFile(
                    logoFile,
                    `our-dealers/${Date.now()}_${logoFile.name}`
                );
            }
            await onSubmit({ ...formData, logoUrl: finalLogoUrl });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-white p-6 rounded-xl border"
        >
            <MultilingualInput
                label="Название дилера"
                value={formData.title}
                onChange={(title) => setFormData({ ...formData, title })}
                required
            />

            <div className="space-y-2">
                <Label>Логотип дилера</Label>
                <div className="relative h-32 w-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted overflow-hidden">
                    {logoPreview || formData.logoUrl ? (
                        <Image
                            src={logoPreview || formData.logoUrl}
                            alt="Logo"
                            fill
                            className="object-contain p-2"
                        />
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center">
                            <ImagePlus className="h-6 w-6 text-muted-foreground" />
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (f) {
                                        setLogoFile(f);
                                        setLogoPreview(URL.createObjectURL(f));
                                    }
                                }}
                            />
                        </label>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Label className="text-lg font-bold">
                        Адреса и филиалы
                    </Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddAddress}
                    >
                        <Plus className="h-4 w-4 mr-1" /> Добавить адрес
                    </Button>
                </div>

                {formData.addresses.map((addr, idx) => (
                    <div
                        key={idx}
                        className="p-4 border rounded-lg bg-gray-50 space-y-4 relative"
                    >
                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7"
                            onClick={() => handleRemoveAddress(idx)}
                            disabled={formData.addresses.length === 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Название/Адрес филиала</Label>
                                <Input
                                    value={addr.title}
                                    onChange={(e) =>
                                        handleAddressChange(
                                            idx,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    placeholder="г. Ташкент, ул. ..."
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Телефоны</Label>
                                <Input
                                    value={addr.phoneNumbers}
                                    onChange={(e) =>
                                        handleAddressChange(
                                            idx,
                                            "phoneNumbers",
                                            e.target.value
                                        )
                                    }
                                    placeholder="+998 ..."
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Email</Label>
                                <Input
                                    type="email"
                                    value={addr.email}
                                    onChange={(e) =>
                                        handleAddressChange(
                                            idx,
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="dealer@info.uz"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <Label>Ссылка на карту (Google/Yandex)</Label>
                                <Input
                                    value={addr.map}
                                    onChange={(e) =>
                                        handleAddressChange(
                                            idx,
                                            "map",
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://goo.gl/maps/..."
                                    required
                                />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <Label>Сайт (опционально)</Label>
                                <Input
                                    value={addr.website}
                                    onChange={(e) =>
                                        handleAddressChange(
                                            idx,
                                            "website",
                                            e.target.value
                                        )
                                    }
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-4 border-t pt-6">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Отмена
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        "Сохранить дилера"
                    )}
                </Button>
            </div>
        </form>
    );
}
