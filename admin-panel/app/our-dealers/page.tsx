"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Globe, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    getAllDealers,
    addDealer,
    updateDealer,
    deleteDealer,
} from "@/lib/firebase/our-dealers";
import { Dealer } from "@/types";
import DealerForm from "@/components/admin/OurDealersForm";
import Image from "next/image";

export default function AdminDealersPage() {
    const [dealers, setDealers] = useState<Dealer[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState<Dealer | null>(null);

    const load = async () => setDealers(await getAllDealers());
    useEffect(() => {
        load();
    }, []);

    const handleFormSubmit = async (data: any) => {
        if (current) await updateDealer(current.id, data);
        else await addDealer(data);
        setIsEditing(false);
        load();
    };

    if (isEditing)
        return (
            <div className="p-8 max-w-5xl mx-auto">
                <DealerForm
                    initialData={current}
                    onSubmit={handleFormSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            </div>
        );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Наши дилеры</h1>
                <Button
                    onClick={() => {
                        setCurrent(null);
                        setIsEditing(true);
                    }}
                >
                    <Plus className="mr-2" /> Добавить дилера
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {dealers.map((dealer) => (
                    <div
                        key={dealer.id}
                        className="border rounded-xl p-6 bg-white flex flex-col md:flex-row gap-6 items-start shadow-sm"
                    >
                        <div className="relative h-20 w-40 flex-shrink-0 border rounded bg-gray-50 p-2">
                            <Image
                                src={dealer.logoUrl}
                                alt="Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">
                                {dealer.title.ru}
                            </h3>
                            <div className="text-sm text-muted-foreground space-y-1">
                                {dealer.addresses.map((a, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2"
                                    >
                                        <MapPin className="h-3 w-3" /> {a.title}{" "}
                                        | <Phone className="h-3 w-3" />{" "}
                                        {a.phoneNumbers}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                    setCurrent(dealer);
                                    setIsEditing(true);
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="destructive"
                                size="icon"
                                onClick={async () => {
                                    if (confirm("Удалить?")) {
                                        await deleteDealer(dealer.id);
                                        load();
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
