"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            await signIn(email, password);

            // Показываем успех
            toast({
                title: "Успешно",
                description: "Вы успешно вошли в систему",
            });

            // Небольшая задержка чтобы cookie успел установиться
            setTimeout(() => {
                router.push("/");
            }, 100);
        } catch (error: any) {
            console.error("Login error:", error);

            let errorMessage = "Не удалось войти в систему";

            if (
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
            ) {
                errorMessage = "Неверный email или пароль";
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Слишком много попыток. Попробуйте позже";
            } else if (error.code === "auth/invalid-credential") {
                errorMessage = "Неверные учетные данные";
            }

            toast({
                title: "Ошибка",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Вход в админ панель
                    </CardTitle>
                    <CardDescription>
                        Введите ваш email и пароль для входа
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Пароль</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                disabled={loading}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Вход..." : "Войти"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
