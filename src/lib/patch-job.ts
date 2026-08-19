import { apiUrl } from "./api";

export async function patchJob(
    jobId: bigint,
    payload: { action: string; [key: string]: unknown }
) {
    const res = await fetch(apiUrl(`/api/jobs/${jobId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update job");
    }

    return res.json();
}