import Header from "@/components/server/Header";
import { getProductsServer } from "@/lib/firebase/server-api";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

export default async function Home() {
    const t = await getTranslations();
    const products = await getProductsServer();
    return (
        <div>
            <Header />
            <Image
                src={"/images/hero-bg.png"}
                alt="hero-bg"
                loading="lazy"
                width={5000}
                height={5000}
                className="h-screen w-full"
            />
        </div>
    );
}
