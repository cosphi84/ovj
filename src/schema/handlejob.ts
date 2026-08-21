import { z } from "zod";

export const HandleJobScheme = z.object({
    handledBy: z.number().min(1, {
        error: "User harus di isi",
    }).optional(),

    handledOn: z.date({
        error: "Tanggal handling harus di isi",
    }).optional(),

    actionTakenByTC: z.string().min(1, {
        error: "Perbaikan yang dilakukan tidak boleh kosong",
    }).optional(),

    result: z.enum(["OK", "FAILED"]).optional(),
});

export type HandleJobFormValues = z.infer<typeof HandleJobScheme>;

export const HandleJobDefaultFormValues: HandleJobFormValues = {
    handledBy: 0,
    handledOn: new Date(),
    actionTakenByTC: "",
    result: "OK",
};