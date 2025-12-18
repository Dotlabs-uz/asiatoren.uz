import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
    const cookieStore = (await cookies()) as any;
    const locale = cookieStore.get("locale")?.value || "ru";

    return {
        locale,
        messages: (await import(`../langs/${locale}.json`)).default,
    };
});
