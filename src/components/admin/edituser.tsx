"use client"

import { UserProfile } from "@/interface/user"
import { ApiUrlUserEdit,  UserEditFormValues,  UserEditSchema,  UserFormValues, UserSchema } from "@/schema/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import { EditIcon } from "lucide-react";

type Props = {
    user: UserProfile;
}

export default function EditUser({ user }: Props){
    const router = useRouter();
    const usrForm = useForm<UserEditFormValues>({
        resolver: zodResolver(UserEditSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            active: user.active
        }
    });

    const onSubmit = async (u: UserFormValues) => {
        const payload = JSON.stringify(u);

        if(!confirm("Save the user?"))
        {
            return;
        }

        try{
            const response = await fetch(ApiUrlUserEdit(user.id), {
                method: "POST",
                headers: {
                    "Content-Type": "Appliction/json"
                },
                body: payload
            });

            const res = await response.json();

            if(!response.ok){
                toast.add({
                    title: "Error on create new User",
                    type: "error",
                    description: `Error: ${res?.error}`
                });
                return;
            }

            toast.add({
                title: "Create new users success.",
                type: "success",
                description: `Create new user ${u.name} done.`
            });
            router.push("/admin/users");
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
                        
                        <Field orientation="horizontal" className="justify-center">
                                    <Button
                                        type="submit"
                                        form="frmUser"
                                        //disabled={isPending}  // ✅ prevent double submit
                                        className="bg-primary rounded-md w-1/2 cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-300"
                                    >
                                        <EditIcon className="h-6 w-6" />
                                        Save
                                    </Button>
                                </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}