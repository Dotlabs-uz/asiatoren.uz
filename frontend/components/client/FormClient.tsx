"use client";

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

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Имя должно содержать минимум 2 символа",
    }),
    phone: z.string().min(10, {
        message: "Введите корректный номер телефона",
    }),
    email: z.string().email({
        message: "Введите корректный email",
    }),
});

type FormValues = z.infer<typeof formSchema>;

export const FormClient = () => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            // Здесь будет логика отправки формы
            console.log(values);

            // Имитация отправки
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success("Заявка успешно отправлена!");
            form.reset();
        } catch (error) {
            toast.error("Произошла ошибка. Попробуйте снова.");
        }
    };

    return (
        <div className="bg-gray-100 rounded-3xl md:rounded-[3rem] p-8 md:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                {/* Left Side - Text */}
                <div className="flex flex-col gap-6 md:gap-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cGray leading-tight">
                        Получите
                        <br />
                        консультацию
                        <br />
                        специалиста
                    </h2>
                    <p className="text-base md:text-lg text-gray-500">
                        Мы свяжемся с вами
                        <br />в течении 2 рабочих дней
                    </p>
                </div>

                {/* Right Side - Form */}
                <div className="w-full">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="flex flex-col gap-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Ваше имя"
                                                className="h-14 md:h-16 px-6 text-base md:text-lg bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300 placeholder:text-gray-400"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-cRed text-sm mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Номер телефона"
                                                type="tel"
                                                className="h-14 md:h-16 px-6 text-base md:text-lg bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300 placeholder:text-gray-400"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-cRed text-sm mt-1" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Электронная почта"
                                                type="email"
                                                className="h-14 md:h-16 px-6 text-base md:text-lg bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300 placeholder:text-gray-400"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-sm mt-1" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-14 md:h-16 bg-cRed hover:bg-cRed/80 text-white text-base md:text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl mt-2"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Отправка..."
                                    : "Отправить"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};
