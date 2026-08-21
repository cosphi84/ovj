import { z } from "zod";

export const CompletedSchema = z.object({
    completedOn: z.date().optional(),
    action: z.string().optional(),
});

export type CompletedFormValue = z.infer<typeof CompletedSchema>

export const CompletedDefaultFormValue: CompletedFormValue = {
    completedOn: new Date(),
    action: "completed"
}

