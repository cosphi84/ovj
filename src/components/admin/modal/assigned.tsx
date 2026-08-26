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
import UsersSelect from "@/components/Users";
import { Save } from "lucide-react";
import { patchJob } from "@/lib/patch-job";
import { toast } from "@/components/ui/toast";
import {useRouter} from "next/navigation";
import { z } from 'zod';

interface Props {
    job: Job;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AssignTechnician({
    job,
    open,
    onOpenChange,
}: Props) {
    const router = useRouter();
    const handleSubmit = async (v: z.infer<typeof AssignFormSchema>) => {
        const payload = {
            handledBy: v.handledBy,
            action: 'assign'
        }

        try{
            await patchJob(job.id, payload)
            router.refresh();
            toast.add({
                title: "Save Action done",
                type: "success",
                description: `Assign Job ID #${job.id} Done`
            });
        }catch (e) {
                const message = e instanceof Error ? e.message : "Something went wrong";
                toast.add({
                    title: "Proses Saving Assigned Failed",
                    type: "error",
                    description: message,
                });
            }
        onOpenChange(false);
    };

    const AssignFormSchema = z.object({
        handledBy: z.number().optional()
    })

    const frmHandle = useForm<z.infer<typeof AssignFormSchema>>({
        resolver: zodResolver(AssignFormSchema),
        defaultValues: {
            handledBy: 0
        }
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Handle Job</DialogTitle>

                    <DialogDescription>
                        Assign Job ID #{job.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <form id="frmHandled" onSubmit={frmHandle.handleSubmit(handleSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="handledBy"
                                control={frmHandle.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="handledBy">
                                            Assign to
                                        </FieldLabel>

                                        <UsersSelect value={field.value} onChange={field.onChange} />

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
    )
}