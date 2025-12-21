import { getTranslations } from "next-intl/server";
import HeaderClient from "../client/HeaderClient";

export default async function Header() {
    const t = await getTranslations("header");

    const text = {
        pages: [
            { href: "/products", label: t("nav.products") },
            { href: "/about-us", label: t("nav.about") },
            { href: "/contacts", label: t("nav.contacts") },
        ],
        btn: t("btn"),
    };

    return <HeaderClient text={text} />;
}
