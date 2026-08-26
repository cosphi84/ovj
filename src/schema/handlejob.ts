import { z } from "zod";

export const HandleJobScheme = z.object({
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
    handledOn: new Date(),
    actionTakenByTC: "",
    result: "OK",
};
