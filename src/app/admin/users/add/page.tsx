"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { ApiUrlUser, UserFormDefaultValues, UserFormValues, UserSchema } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";

export default function AddUserPage(){
    const router = useRouter();
    const usrForm = useForm<UserFormValues>({
        resolver: zodResolver(UserSchema),
        defaultValues: UserFormDefaultValues
    });

    const onSubmit = async (u: UserFormValues) => {
        const payload = JSON.stringify(u);

        if(!confirm("Save and create new user?"))
        {
            return;
        }

        try{
            const response = await fetch(ApiUrlUser, {
                method: "POST",
                headers: {
                    "Content-Type": "Appliction/json"
                },
                body: payload
            });

            const res = await response.json();

            if(!res.ok){
                toast.add({
                    title: "Error on create new User",
                    type: "error",
                    description: `Error: {res?.error}`
                });
                return;
            }

            toast.add({
                title: "Create new users success.",
                type: "success",
                description: `Create new user ${u.name} done.`
            });
            router.push("admin/users");
        }catch(error){
            toast.add({
                title: "Failed to submit request",
                description: `${error}`,
                type: "error"
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create new TC User</CardTitle>
            </CardHeader>
            <CardContent>
                <form id="frmUser" onSubmit={usrForm.handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow">
                    <FieldGroup>
                        <Controller
                            name="name"
                            control={usrForm.control}
                            render={({ field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="usrForm-name">Name</FieldLabel>

                                    <Input 
                                        {...field}
                                        id="usrForm-name"
                                        type="text"
                                        placeholder="User Name"
                                        aria-invalid={fieldState.invalid}
                                        aria-label="Name"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                        autoFocus={true}
                                    />

                                    { fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="email"
                            control={usrForm.control}
                            render={({ field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="usrForm-email">Email</FieldLabel>

                                    <Input 
                                        {...field}
                                        id="usrForm-email"
                                        type="email"
                                        placeholder="User Email"
                                        aria-invalid={fieldState.invalid}
                                        aria-label="email"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />

                                    { fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={usrForm.control}
                            render={({ field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="usrForm-password">Password</FieldLabel>

                                    <Input 
                                        {...field}
                                        id="usrForm-password"
                                        type="password"
                                        placeholder="Password"
                                        aria-invalid={fieldState.invalid}
                                        aria-label="Password"
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />

                                    { fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                         <Controller
                            name="password"
                            control={usrForm.control}
                            render={({ field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="usrForm-active">Active</FieldLabel>

                                    <Switch
                                    {...field}
                                    id="usrForm-active"
                                    value={field.value}
                                    />

                                    { fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                            />

                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}