// components/Form.tsx
import { getTranslations } from "next-intl/server";
import { FormClient } from "../client/FormClient";

export default async function Form() {
    const t = await getTranslations("form");

    // Извлекаем все необходимые переводы как обычные строки
    const translations = {
        title: t.raw("title"),
        p: t.raw("p"),
        name: t("name"),
        phone: t("phone"),
        email: t("email"),
        btn1: t("btn1"),
        btn2: t("btn2"),
        // Валидационные сообщения
        nameError: t("nameError"),
        phoneError: t("phoneError"),
        emailError: t("emailError"),
        successMessage: t("successMessage"),
        errorMessage: t("errorMessage"),
    };

    return (
        <section className="relative w-full py-12 md:py-20 px-5 sm:px-8 lg:px-16 bg-white overflow-hidden">
            {/* Content */}
            <div className="relative z-10 max-w-[1400px] mx-auto">
                <FormClient translations={translations} />
            </div>
        </section>
    );
}
