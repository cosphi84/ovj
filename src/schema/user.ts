import { apiUrl } from "@/lib/api";
import {z} from "zod";

export const UserSchema = z.object({
    name: z.string().min(1, { error: "Name is required" }),
    email: z.string().email().min(1, { error: "Email is required" }),
    password: z.string().min(1, { error: "Password is required" }),
     active: z.boolean({
        error: "Active status is required",
    }),
})

export const UserEditSchema = z.object({
    name: z.string().min(1, { error: "Name is required" }),
    email: z.string().email().min(1, { error: "Email is required" }),
    password: z.string().optional(),
     active: z.boolean({
        error: "Active status is required",
    }),
})


export type UserFormValues = z.infer<typeof UserSchema>
export type UserEditFormValues = z.infer<typeof UserEditSchema>

export const UserFormDefaultValues = {
    name: "",
    email: "",
    password: "",
    active: true
}

export const ApiUrlUser = apiUrl("/api/users");
export const ApiUrlUserEdit = (id: number) => apiUrl(`/api/users/${id}`);