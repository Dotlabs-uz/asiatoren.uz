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
            message: t("form.message"),
            agree: t("form.agree"),
            terms: t("form.terms"),
            privacy: t("form.privacy"),
            submit: t("form.submit"),
            sending: t("form.sending"),
            successMessage: t("form.messages.success"),
            errorMessage: t("form.messages.error"),
            firstNameError: t("form.validation.firstName"),
            lastNameError: t("form.validation.lastName"),
            phoneError: t("form.validation.phone"),
            messageError: t("form.validation.message"),
            agreeError: t("form.validation.agree"),
        },
        contact: {
            phone: t("contact.phone"),
            email: t("contact.email"),
            address: t("contact.address"),
            connectTitle: t("contact.connectTitle"),
        },
    };

    return <ContactsPageClient translations={translations} />;
}
