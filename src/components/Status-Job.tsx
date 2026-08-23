"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { JobResponse } from "@/interface/job";

interface HandleStatusProps {
    job: JobResponse;
}

interface StatusConfig {
    label: string;
    className: string;
}

function resolveStatus(job: JobResponse): StatusConfig {
    // Urutan pengecekan HARUS dari tahap terakhir ke awal,
    // karena tanggal tahap belakang hanya terisi kalau tahap depan sudah lewat.
    if (job.completedOn) {
        return {
            label: "Completed",
            className: "bg-green-100 text-green-800 border-green-300",
        };
    }
    if (job.sendBackOn) {
        return {
            label: "Send Back",
            className: "bg-purple-100 text-purple-800 border-purple-300",
        };
    }
    if (job.handledOn) {
        return {
            label: "Handled",
            className: "bg-blue-100 text-blue-800 border-blue-300",
        };
    }
    if (job.receivedOn) {
        return {
            label: "Received",
            className: "bg-cyan-100 text-cyan-800 border-cyan-300",
        };
    }
    if (job.approvedOn) {
        return {
            label: "Approved",
            className: "bg-yellow-100 text-yellow-800 border-yellow-300",
        };
    }
    return {
        label: "Pending",
        className: "bg-gray-100 text-gray-800 border-gray-300",
    };
}

export default function StatusJob({ job }: HandleStatusProps) {
    const status = useMemo(() => resolveStatus(job), [job]);

    return (
        <Badge variant="outline" className={status.className}>
        {status.label}
        </Badge>
);
}