"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/admin/AuthProvider";
import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { ErrorBoundary } from "@/components/admin/ErrorBoundary";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    // Если это страница логина - показываем без layout
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }
    // Для всех остальных страниц - показываем с layout и AuthProvider
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