import { z } from "zod";

export const SendBackJobSchema = z.object({
    sendbackOn: z.date().optional(),
    sendbackBy: z.number().optional(),
    awbNumber: z.string().optional()
});

export type SendBackFormValue = z.infer<typeof SendBackJobSchema>

export const SendBackDefaultFormValue: SendBackFormValue = {
    sendbackOn: new Date(),
    sendbackBy: 0,
    awbNumber: ""
}

