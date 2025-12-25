// app/[locale]/contacts/page.tsx
import ContactsPageClient from "@/components/client/ContactsPageClient";
import { getTranslations } from "next-intl/server";

export default async function ContactsPage() {
    const t = await getTranslations("contacts-page");

    const translations = {
        hero: {
            title: t("hero.title"),
            subtitle: t("hero.subtitle"),
        },
        form: {
            title: t("form.title"),
            firstName: t("form.firstName"),
            lastName: t("form.lastName"),
            phone: t("form.phone"),
            email: t("form.email"),
            message: t("form.message"),
            submit: t("form.submit"),
            sending: t("form.sending"),
            successMessage: t("form.successMessage"),
            errorMessage: t("form.errorMessage"),
            firstNameError: t("form.firstNameError"),
            lastNameError: t("form.lastNameError"),
            phoneError: t("form.phoneError"),
            emailError: t("form.emailError"),
            messageError: t("form.messageError"),
        },
        contact: {
            phone1: t("contact.phone1"),
            phone2: t("contact.phone2"),
            email: t("contact.email"),
            address1: {
                title: t("contact.address1.title"),
                address: t("contact.address1.address"),
                mapUrl: t("contact.address1.mapUrl"),
            },
            address2: {
                title: t("contact.address2.title"),
                address: t("contact.address2.address"),
                mapUrl: t("contact.address2.mapUrl"),
            },
            connectTitle: t("contact.connectTitle"),
            socialTitle: t("contact.socialTitle"),
        },
    };

    return <ContactsPageClient translations={translations} />;
}
