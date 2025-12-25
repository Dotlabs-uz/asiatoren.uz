"use client";

interface ContactsPageClientProps {
    translations: any;
}

export default function ContactsPageClient({
    translations,
}: ContactsPageClientProps) {
    return (
        <div>
            <div className="bg-[url('/images/farm.png')] bg-cover bg-center bg-no-repeat w-full h-[50vh]"></div>
        </div>
    );
}
