// components/client/ContactsPageForm.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

interface ContactsPageFormProps {
    translations: {
        title: string;
        firstName: string;
        lastName: string;
        phone: string;
        message: string;
        agree: string;
        terms: string;
        privacy: string;
        submit: string;
        sending: string;
        successMessage: string;
        errorMessage: string;
        firstNameError: string;
        lastNameError: string;
        phoneError: string;
        messageError: string;
        agreeError: string;
    };
}

export const ContactsPageForm = ({ translations }: ContactsPageFormProps) => {
    const formSchema = z.object({
        firstName: z.string().min(2, {
            message: translations.firstNameError,
        }),
        lastName: z.string().min(2, {
            message: translations.lastNameError,
        }),
        phone: z.string().min(10, {
            message: translations.phoneError,
        }),
        message: z.string().min(10, {
            message: translations.messageError,
        }),
        agree: z.boolean().refine((val) => val === true, {
            message: translations.agreeError,
        }),
    });

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            message: "",
            agree: false,
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            console.log(values);
            // Здесь отправка данных на сервер
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success(translations.successMessage);
            form.reset();
        } catch (error) {
            toast.error(translations.errorMessage);
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
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder={translations.firstName}
                                            className="h-14 px-6 text-base bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-cRed text-sm mt-1" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder={translations.lastName}
                                            className="h-14 px-6 text-base bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-cRed text-sm mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Phone */}
                    <div className="form-field">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            placeholder={translations.phone}
                                            type="tel"
                                            className="h-14 px-6 text-base bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300"
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
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder={translations.message}
                                            className="min-h-40 px-6 py-4 text-base bg-white border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-gray-300 resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-cRed text-sm mt-1" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Checkbox */}
                    <div className="form-field">
                        <FormField
                            control={form.control}
                            name="agree"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            className="mt-1"
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <p className="text-sm text-gray-600">
                                            {translations.agree}{" "}
                                            <a
                                                href="/terms"
                                                className="text-cRed hover:underline"
                                            >
                                                {translations.terms}
                                            </a>{" "}
                                            &{" "}
                                            <a
                                                href="/privacy"
                                                className="text-cRed hover:underline"
                                            >
                                                {translations.privacy}
                                            </a>
                                        </p>
                                        <FormMessage className="text-cRed text-sm" />
                                    </div>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="form-button">
                        <Button
                            type="submit"
                            className="w-full h-14 bg-cRed hover:bg-cRed/90 text-white text-base font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl mt-2 group"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting
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
