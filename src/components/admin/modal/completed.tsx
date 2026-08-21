"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Job } from "@/interface/job";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { DatePicker } from "@/components/DatePicker";
import { Save } from "lucide-react";
import { patchJob } from "@/lib/patch-job";
import { toast } from "@/components/ui/toast";
import { CompletedDefaultFormValue, CompletedFormValue, CompletedSchema } from "@/schema/completed";
import {useRouter} from "next/navigation";

interface Props {
    job: Job;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CompletedModal({
    job,
    open,
    onOpenChange,
}: Props) {
    const router = useRouter();
    const handleSubmit = async (v: CompletedFormValue) => {
        const payload = {
            completedOn: v.completedOn,
            action: 'complete'
        }

        try{
            await patchJob(job.id, payload)
            router.refresh();
            toast.add({
                title: "Save Action done",
                type: "success",
                description: `Job ID #${job.id} Completed Done`
            });
        }catch (e) {
                const message = e instanceof Error ? e.message : "Something went wrong";
                toast.add({
                    title: "Proses Save Completed Failed",
                    type: "error",
                    description: message,
                });
            }
        onOpenChange(false);
    };

    const frmHandle = useForm<CompletedFormValue>({
        resolver: zodResolver(CompletedSchema),
        defaultValues: CompletedDefaultFormValue
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Completing Job</DialogTitle>

                    <DialogDescription>
                        Completing Job ID #{job.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <form id="frmHandled" onSubmit={frmHandle.handleSubmit(handleSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="completedOn"
                                control={frmHandle.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="handledOn">
                                            Completed Date
                                        </FieldLabel>

                                        <DatePicker value={field.value} onChange={field.onChange} />

                                        { fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                        </FieldGroup>
                    </form>
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button form="frmHandled" type="submit">
                        <Save /> Save
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}