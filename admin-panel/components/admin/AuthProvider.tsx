"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuth } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";
import { Loader2 } from "lucide-react";

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Не делаем ничего пока загружается
        if (loading) return;

        // Если нет пользователя - редирект на логин
        if (!user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    // Показываем loader пока проверяется авторизация
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        Загрузка...
                    </p>
                </div>
            </div>
        );
    }

    // Если нет пользователя, не показываем children (редирект в процессе)
    if (!user) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within AuthProvider");
    }
    return context;
}
