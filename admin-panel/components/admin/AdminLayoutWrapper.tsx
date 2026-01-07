"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/admin/AuthProvider";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { ErrorBoundary } from "@/components/admin/ErrorBoundary";

export function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // // Проверяем домен
    // const isAdminDomain =
    //     typeof window !== "undefined" &&
    //     window.location.hostname.startsWith("admin.");

    // // Если это НЕ админ домен - рендерим без обёртки (фронт)
    // if (!isAdminDomain) {
    //     return <>{children}</>;
    // }

    // Если это страница логина - показываем без layout
    if (pathname === "/login") {
        return <>{children}</>;
    }

    // Для всех остальных страниц админки (включая главную)
    return (
        <AuthProvider>
            <ErrorBoundary>
                <div className="flex h-screen overflow-hidden">
                    <Sidebar />
                    <div className="flex flex-col flex-1 md:ml-64">
                        <Header />
                        <main className="flex-1 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </div>
            </ErrorBoundary>
        </AuthProvider>
    );
}
