// components/client/FormClient.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createApplication } from "@/lib/firebase/public-api";

gsap.registerPlugin(ScrollTrigger);

interface Translations {
    title: string;
    p: string;
    name: string;
    surname: string; // ← Добавлено
    phone: string;
    email: string;
    btn1: string;
    btn2: string;
    nameError: string;
    surnameError: string; // ← Добавлено
    phoneError: string;
    emailError: string;
    successMessage: string;
    errorMessage: string;
}

interface FormClientProps {
    translations: Translations;
}

export const FormClient = ({ translations }: FormClientProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false);

    // Создаем схему валидации с переведенными сообщениями
    const formSchema = z.object({
        name: z.string().min(2, {
            message: translations.nameError,
        }),
        surname: z.string().min(2, {
            message: translations.surnameError,
        }),
        phoneNumber: z.string().min(10, {
            message: translations.phoneError,
        }),
        email: z.string().email({
            message: translations.emailError,
        }),
    });

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            surname: "",
            phoneNumber: "",
            email: "",
        },
    });

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                    end: "top 20%",
                    toggleActions: "play none none reverse",
                },
            });

            // 1. Заголовок
            tl.from(".form-title", {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out",
            });

            // 2. Параграф
            tl.from(
                ".form-description",
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    ease: "power3.out",
                },
                "-=0.4"
            );

            // 3. Поля формы с stagger
            tl.from(
                ".form-field",
                {
                    x: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                },
                "-=0.3"
            );

            // 4. Кнопка
            tl.from(
                ".form-button",
                {
                    y: 30,
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.6,
                    ease: "back.out(1.7)",
                },
                "-=0.2"
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const onSubmit = async (data: FormValues) => {
        try {
            setLoading(true);
            await createApplication(data);

            toast.success(translations.successMessage);
            form.reset();
        } catch (error) {
            console.error("Error submitting application:", error);
            toast.error(translations.errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className="bg-gray-100 rounded-3xl md:rounded-[3rem] p-8 md:p-12 lg:p-16"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left Side - Text */}
                <div className="flex flex-col gap-6 md:gap-8">
                    <h2
                        className="form-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cGray leading-tight"
                        dangerouslySetInnerHTML={{ __html: translations.title }}
                    />
                    <p
                        className="form-description text-base md:text-lg text-gray-500"
                        dangerouslySetInnerHTML={{ __html: translations.p }}
                    />
                </div>

                {/* Right Side - Form */}
                <div className="w-full">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4"
                        >
                            {/* Имя и Фамилия в одну строку на больших экранах */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="form-field">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder={
                                                            translations.name
                                                        }
                                                        className="h-14 md:h-16 px-6 text-base md:text-lg bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300 placeholder:text-gray-400"
                                                        disabled={loading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-cRed text-sm mt-1" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="form-field">
                                    <FormField
                                        control={form.control}
                                        name="surname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        placeholder={
                                                            translations.surname
                                                        }
                                                        className="h-14 md:h-16 px-6 text-base md:text-lg bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300 placeholder:text-gray-400"
                                                        disabled={loading}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-cRed text-sm mt-1" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="form-field">
                                <FormField
                                    control={form.control}
                                    name="phoneNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder={
                                                        translations.phone
                                                    }
                                                    type="tel"
                                                    className="h-14 md:h-16 px-6 text-base md:text-lg bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300 placeholder:text-gray-400"
                                                    disabled={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-cRed text-sm mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="form-field">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    placeholder={
                                                        translations.email
                                                    }
                                                    type="email"
                                                    className="h-14 md:h-16 px-6 text-base md:text-lg bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300 placeholder:text-gray-400"
                                                    disabled={loading}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-cRed text-sm mt-1" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="form-button">
                                <Button
                                    type="submit"
                                    className="w-full h-14 md:h-16 bg-cRed hover:bg-cRed/80 text-white text-base md:text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl mt-2"
                                    disabled={loading}
                                >
                                    {loading
                                        ? translations.btn2
                                        : translations.btn1}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};
