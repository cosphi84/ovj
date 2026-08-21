import { z } from "zod";

export const SendBackJobSchema = z.object({
    sendbackOn: z.date().optional(),
    awbNumber: z.string().optional()
});

export type SendBackFormValue = z.infer<typeof SendBackJobSchema>

export const SendBackDefaultFormValue: SendBackFormValue = {
    sendbackOn: new Date(),
    awbNumber: ""
}

