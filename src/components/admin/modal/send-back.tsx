"use client";

import { DatePicker } from "@/components/DatePicker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Job } from "@/interface/job";
import { patchJob } from "@/lib/patch-job";
import { SendBackDefaultFormValue, SendBackFormValue, SendBackJobSchema } from "@/schema/sendback";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Controller, useForm } from "react-hook-form";


interface Props {
    job: Job;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}


export default function SendBack({ job, open, onOpenChange }: Props){
    const handleSubmit = async (v: SendBackFormValue) => {
        const payload = {
            sendbackOn: v.sendbackOn,
            awbNumber: v.awbNumber,
            action: "sendback"
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
    }

    const frmSendBack = useForm<SendBackFormValue>({
        resolver: zodResolver(SendBackJobSchema),
        defaultValues: SendBackDefaultFormValue
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send back Job</DialogTitle>

                    <DialogDescription>
                        Send Back Job ID #{job.id}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <form id="frmHandled" onSubmit={frmSendBack.handleSubmit(handleSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="sendbackOn"
                                control={frmSendBack.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="sendbackOn">
                                            Send Back Date
                                        </FieldLabel>

                                        <DatePicker value={field.value} onChange={field.onChange} />

                                        { fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="awbNumber"
                                control={frmSendBack.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} >
                                        <FieldLabel htmlFor="awbNumber">
                                            No AWB
                                        </FieldLabel>

                                        <Input {...field} id="awbNumber" type="text" placeholder="Exspedisi : AWB Number" />

                                        {fieldState.invalid && (
                                            <FieldError errors={[ fieldState.error]} />
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