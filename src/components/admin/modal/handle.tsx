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
import { HandleJobDefaultFormValues, HandleJobFormValues, HandleJobScheme } from "@/schema/handlejob";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import UsersSelect from "@/components/Users";
import { DatePicker } from "@/components/DatePicker";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save } from "lucide-react";
import { Label } from "@/components/ui/label";
import { apiUrl } from "@/lib/api";
import { patchJob } from "@/lib/patch-job";
import { toast } from "@/components/ui/toast";

interface Props {
    job: Job;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function HandleByModal({
    job,
    open,
    onOpenChange,
}: Props) {
    const handleSubmit = async (v: HandleJobFormValues) => {
        const payload = {
            handledBy: v.handledBy,
            handledOn: v.handledOn,
            actionTakenByTC: v.actionTakenByTC,
            result: v.result,
            action: 'handle'
        }

        try{
            await patchJob(job.id, payload)
            toast.add({
                title: "Save Action done",
                type: "success",
                description: `Handle Job ID #${job.id} Done`
            });
        }catch (e) {
                const message = e instanceof Error ? e.message : "Something went wrong";
                toast.add({
                    title: "Proses Save Handled Failed",
                    type: "error",
                    description: message,
                });
            }
        onOpenChange(false);
    };

    const frmHandle = useForm<HandleJobFormValues>({
        resolver: zodResolver(HandleJobScheme),
        defaultValues: HandleJobDefaultFormValues
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Handle Job</DialogTitle>

                    <DialogDescription>
                        Handle Job ID #{job.id}
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
                                            Handled By
                                        </FieldLabel>

                                        <UsersSelect value={field.value} onChange={field.onChange} />

                                        { fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="handledOn"
                                control={frmHandle.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="handledOn">
                                            Finish Date
                                        </FieldLabel>

                                        <DatePicker value={field.value} onChange={field.onChange} />

                                        { fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="actionTakenByTC"
                                control={frmHandle.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="actionTakenByTC">
                                            Action yang dilakukan
                                        </FieldLabel>
                                        <Textarea 
                                            {...field}
                                            placeholder="Apa yang dilakukan TC"
                                            />

                                        { fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="result"
                                control={frmHandle.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="result">
                                            Result
                                        </FieldLabel>
                                            <RadioGroup value={field.value} onValueChange={field.onChange}>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value={"OK"} id="OK"/ >
                                                    <Label htmlFor="OK">OK</Label>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <RadioGroupItem value={"FAILED"} id="FAILED" />
                                                    <Label htmlFor="FAILED">FAILED</Label>
                                                </div>
                                            </RadioGroup>

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