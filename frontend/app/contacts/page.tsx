import ContactsPageClient from "@/components/client/ContactsPageClient";
import { getTranslations } from "next-intl/server";

export default async function Contacts() {
    const t = await getTranslations("contacts-page");

    const translation = {};
    return <ContactsPageClient translations={translation} />;
}
