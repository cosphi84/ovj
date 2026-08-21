import { z } from "zod";

export const SendBackJobSchema = z.object({
    sendBackOn: z.date().optional(),
    sendBackBy: z.number().optional(),
    awbNumber: z.string().optional()
});

export type SendBackFormValue = z.infer<typeof SendBackJobSchema>

export const SendBackDefaultFormValue: SendBackFormValue = {
    sendBackOn: new Date(),
    sendBackBy: 0,
    awbNumber: ""
}

