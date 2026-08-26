"use client"

import {Job, JobState} from "@/interface/job";
import { Card , CardHeader, CardTitle, CardDescription, CardContent} from "@/components/ui/card";
import {useRouter} from "next/navigation";
import {useMemo, useState, useTransition} from "react";
import getJobState from "@/lib/jobs-helper";
import {patchJob} from "@/lib/patch-job";
import { Button } from "@/components/ui/button";
import {toast} from "@/components/ui/toast";
import {Capitalize} from "@/lib/format-helper";
import HandleByModal from "./modal/handle";
import SendBack from "./modal/send-back";
import CompletedModal from "./modal/completed";
import AssignTechnician from "./modal/assigned";

interface Props {
    job: Job;
}

type ModalState = { type: "assign" | "handle" | "sendback" | "complete"; open: boolean };

type ActionConfig = {
    key: keyof JobState;
    label: string;
    onClick: () => void;
    variant: "blue" | "green";
};

const variantClass: Record<ActionConfig["variant"], string> = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
};

export default function ActionField({ job }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [modal, setModal] = useState<ModalState>({ type: "assign", open: false });

    const state = useMemo<JobState>(() => getJobState(job), [job]);

    const runAction = (action: "approve" | "receive" | "complete") => {
        setError(null);
        startTransition(async () => {
            try {
                await patchJob(job.id, { action });
                router.refresh();
                toast.add({
                    title: `${Capitalize(action)} Done.`,
                    type: "success",
                    description: `${Capitalize(action)} for Job ID #${job.id} successfully.`,
                });
            } catch (e) {
                const message = e instanceof Error ? e.message : "Something went wrong";
                setError(message);
                toast.add({
                    title: `${action} gagal`,
                    type: "error",
                    description: message,
                });
            }
        });
    };

    const actions: ActionConfig[] = [
        { key: "canApprove", label: "Approve", onClick: () => runAction("approve"), variant: "blue" },
        { key: "canReceive", label: "Received", onClick: () => runAction("receive"), variant: "blue" },
        { key: "canAssign", label: "Assigned", onClick: () => setModal({ type: "assign", open: true}), variant: "green"},
        { key: "canHandle", label: "Handle", onClick: () => setModal({ type: "handle", open: true }), variant: "blue" },
        { key: "canSendBack", label: "Send Back", onClick: () => setModal({ type: "sendback", open: true }), variant: "blue" },
        { key: "canComplete", label: "Set Completed", onClick: () => setModal({ type: "complete", open: true }), variant: "green" },
    ];


    return (
        <>
        <Card className="col-span-2 bg-white p-6 rounded shadow">
            <CardHeader >
                <CardTitle className={"text-xl font-bold mb-4"}>Actions</CardTitle>
                <CardDescription>Actions group button</CardDescription>
            </CardHeader>
            <CardContent className={"flex flex-wrap gap-2"}>
                {actions.map(({ key, label, onClick, variant }) => (
                    <Button
                        key={key}
                        onClick={onClick}
                        disabled={!state[key] || isPending}
                        className={`px-4 py-2 text-white rounded disabled:opacity-50 ${variantClass[variant]}`}
                    >
                        {label}
                    </Button>
                ))}
            </CardContent>

            {error && <p className="px-6 pb-4 text-sm text-red-500">{error}</p>}
        </Card>

        <HandleByModal 
            job={job}
            open={modal.type === "handle" && modal.open}
            onOpenChange={(open) => setModal({
                type: "handle",
                open
            })}
        />

        <SendBack
            job={job}
            open={modal.type === "sendback" && modal.open}
            onOpenChange={(open) => setModal({
                type: "sendback",
                open
            })}
        />

        <CompletedModal
            job={job}
            open={modal.type === "complete" && modal.open}
            onOpenChange={(open) => setModal({
                type: "complete",
                open
            })}
        />

        <AssignTechnician 
            job={job}
            open={modal.type === "assign" && modal.open}
            onOpenChange={(open) => setModal({
                type: "assign",
                open
            })}
            />
        </>
    )
}