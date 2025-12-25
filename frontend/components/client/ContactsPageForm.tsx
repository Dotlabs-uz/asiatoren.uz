// components/client/ContactsPageForm.tsx
"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { createApplication } from "@/lib/firebase/public-api";

interface ContactsPageFormProps {
    translations: {
        title: string;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        message: string;
        submit: string;
        sending: string;
        successMessage: string;
        errorMessage: string;
        firstNameError: string;
        lastNameError: string;
        phoneError: string;
        emailError: string;
        messageError: string;
    };
}

export const ContactsPageForm = ({ translations }: ContactsPageFormProps) => {
    const [loading, setLoading] = useState(false);

    const formSchema = z.object({
        name: z.string().min(2, {
            message: translations.firstNameError,
        }),
        surname: z.string().min(2, {
            message: translations.lastNameError,
        }),
        phoneNumber: z.string().min(10, {
            message: translations.phoneError,
        }),
        email: z.string().email({
            message: translations.emailError,
        }),
        text: z
            .string()
            .min(10, {
                message: translations.messageError,
            })
            .optional(),
    });

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            surname: "",
            phoneNumber: "",
            email: "",
            text: "",
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            setLoading(true);
            await createApplication(values);

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
        <div className="contact-form bg-gray-100 rounded-3xl p-8 md:p-10 lg:p-12">
            <h2 className="form-title text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8">
                {translations.title}
            </h2>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-4"
                >
                    {/* First Name & Last Name */}
                    <div className="form-field grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder={translations.firstName}
                                            className="h-14 px-6 text-base bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300"
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-cRed text-sm mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="surname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder={translations.lastName}
                                            className="h-14 px-6 text-base bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300"
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-cRed text-sm mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Phone & Email */}
                    <div className="form-field grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder={translations.phone}
                                            type="tel"
                                            className="h-14 px-6 text-base bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300"
                                            disabled={loading}
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
                                            placeholder={translations.email}
                                            type="email"
                                            className="h-14 px-6 text-base bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300"
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-cRed text-sm mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Message */}
                    <div className="form-field">
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder={translations.message}
                                            className="min-h-40 px-6 py-4 text-base bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300 resize-none"
                                            disabled={loading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-cRed text-sm mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="form-button">
                        <Button
                            type="submit"
                            className="w-full h-14 bg-cRed hover:bg-cRed/90 text-white text-base font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl mt-2 group"
                            disabled={loading}
                        >
                            {loading
                                ? translations.sending
                                : translations.submit}
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};
