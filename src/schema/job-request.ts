import {z} from "zod";

export const JobRequestSchema = z.object({
    categoryId: z.number(),
    notification: z.string().min(1, { error: "Notification ID is required" }),
    model: z.string().min(1, { error: "Model ID is required" }),
    serialNumber: z.string().min(1, { error: "Serial Number is required" }),
    symptom: z.string().min(1, { error: "Symptom is required" }),
    actions: z.string().optional(),
    changedParts: z.string().optional(),
    sender: z.string().min(1, { error: "sender ID is required" }),
    requestBy: z.string().min(1, { error: "Request ID is required" }),
    requestByEmail: z.email().min(1, { error: "Request email is required" }),
})

export type JobRequestFormValues = z.infer<typeof JobRequestSchema>

export const JobRequestFormDefaultValues = {
    categoryId: 0,
    notification: "",
    model: "",
    serialNumber: "",
    symptom: "",
    actions: "",
    changedParts: "",
    sender: "",
    requestBy: "",
    requestByEmail: ""
}
