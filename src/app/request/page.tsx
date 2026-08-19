"use client"

import {Controller, useForm} from "react-hook-form";
import {JobRequestFormDefaultValues, JobRequestFormValues, JobRequestSchema} from "@/schema/job-request";
import {zodResolver} from "@hookform/resolvers/zod";
import Link from "next/link";
import { Card , CardHeader, CardContent, CardTitle} from "@/components/ui/card";
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {SaveIcon} from "lucide-react";
import { SelectCategory } from "@/components/Categories";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";

export default function JobRequestPage(){
    const router = useRouter();
    const theForm = useForm<JobRequestFormValues>({
        resolver: zodResolver(JobRequestSchema),
        defaultValues: JobRequestFormDefaultValues
    });

    const onSubmit = async (v: JobRequestFormValues) => {
        const payload = JSON.stringify(v);
        if (!confirm("Are you sure to submit this request?")) {
            return;
        }

        try {
            const response = await fetch(apiUrl("/api/jobs"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: payload
            });

            if (!response.ok) {
                console.log(response)
                toast.add({
                    title: "Failed to submit request",
                    description: "Please try again later.",
                    type: "error"
                });
                return;
            }

            toast.add({
                title: "Request submitted successfully",
                description: "Your request has been submitted.",
                type: "success"
            }); 
            router.push("/");
        } catch (error) {
            console.error("Failed to submit request:", error);
            toast.add({
                title: "Failed to submit request",
                description: "Please try again later.",
                type: "error"
            });
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Link href="/" className="text-blue-500 hover:underline">
                        ← Back to Jobs
                    </Link>
                </div>
            </nav>
            <main className="max-w-4xl mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className={"text-3xl font-bold mb-6"}>
                            Request Transfer Job to TC
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form id={"frmRequest"} onSubmit={theForm.handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow">
                            <FieldGroup>
                                <Controller
                                    name="categoryId"
                                    control={theForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="frmRequest-category">
                                                Category
                                            </FieldLabel>

                                            <SelectCategory
                                                value={field.value}
                                                onChange={field.onChange}
                                            />

                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={"notification"}
                                    control={theForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={"frmRequest-notification"}>
                                                Notification
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={"frmRequest-notification"}
                                                type="text"
                                                placeholder="Notication Number"
                                                aria-invalid={fieldState.invalid}
                                                aria-label="Notification"
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                                autoFocus={true}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={"model"}
                                    control={theForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={"frmRequest-model"}>
                                                Model
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={"frmRequest-model"}
                                                type="text"
                                                placeholder="Model"
                                                aria-invalid={fieldState.invalid}
                                                aria-label="Model"
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={"serialNumber"}
                                    control={theForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={"frmRequest-serialNumber"}>
                                                serial Number
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={"frmRequest-serialNumber"}
                                                type="text"
                                                placeholder="Serial Number"
                                                aria-invalid={fieldState.invalid}
                                                aria-label="serialNumber"
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={"symptom"}
                                    control={theForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={"frmRequest-symptom"}>
                                                Keluhan / Kerusakan
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={"frmRequest-symptom"}
                                                type="text"
                                                placeholder="Keluhan / Kerusakan"
                                                aria-invalid={fieldState.invalid}
                                                aria-label="symptom"
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={"actions"}
                                    control={theForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={"frmRequest-action"}>
                                                Tindakan yang sudah di ambil
                                            </FieldLabel>
                                            <Textarea
                                                {...field}
                                                id={"frmRequest-action"}
                                                aria-invalid={fieldState.invalid}
                                                aria-label="symptom"
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={"changedParts"}
                                    control={theForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={"frmRequest-changedParts"}>
                                                Penggantian parts (Kalau ada)
                                            </FieldLabel>
                                            <Textarea
                                                {...field}
                                                id={"frmRequest-changedParts"}
                                                aria-invalid={fieldState.invalid}
                                                aria-label="changedParts"
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={"sender"}
                                    control={theForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={"frmRequest-sender"}>
                                                Cabang / SDSS / SSR / SASS
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={"frmRequest-sender"}
                                                type="text"
                                                placeholder="Cabang <kota> / SASS <nama SASS>"
                                                aria-invalid={fieldState.invalid}
                                                aria-label="sender"
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={"requestBy"}
                                    control={theForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={"frmRequest-requestBy"}>
                                                Nama Pengirim
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={"frmRequest-requestBy"}
                                                type="text"
                                                placeholder="Nama Anda"
                                                aria-invalid={fieldState.invalid}
                                                aria-label="requestBy"
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name={"requestByEmail"}
                                    control={theForm.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor={"frmRequest-requestByEmail"}>
                                                Email
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={"frmRequest-requestBy"}
                                                type="email"
                                                placeholder="Email"
                                                aria-invalid={fieldState.invalid}
                                                aria-label="requestByEmail"
                                                className="w-full border border-gray-300 rounded px-3 py-2"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Field orientation="horizontal" className="justify-center">
                                    <Button
                                        type="submit"
                                        form="frmRequest"
                                        //disabled={isPending}  // ✅ prevent double submit
                                        className="bg-primary rounded-md w-1/2 cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-300"
                                    >
                                        <SaveIcon className="h-6 w-6" />
                                        Save
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}