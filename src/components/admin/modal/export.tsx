"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { apiUrl } from "@/lib/api";

interface Props {
    open: boolean;
    onClose: () => void;
}

type JobStatus = "Active" | "Completed";

export function ExportData({ open, onClose }: Props) {
    const [status, setStatus] = useState<JobStatus>("Active");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [exporting, setExporting] = useState(false);

    function resetForm() {
        setStatus("Active");
        setStartDate("");
        setEndDate("");
    }

    function handleCancel() {
        if (exporting) return; // jangan biarkan user nutup pas fetch masih jalan
        resetForm();
        onClose();
    }

    async function handleExport() {
        // Validasi range di client. Tetap enforce juga di backend, jangan percaya input user :)
        if (!startDate || !endDate || startDate > endDate) {
            toast.add({
                title: "Invalid range",
                type: "error",
                description: "Start date must be before end date.",
            });
            return;
        }

        setExporting(true);
        try {
            const active = status === "Active" ? "true" : "false";
            const params = new URLSearchParams({ active });
            if (startDate) params.set("startDate", startDate);
            if (endDate) params.set("endDate", endDate);

            const response = await fetch(apiUrl(`/api/export?${params.toString()}`));
            if (!response.ok) {
                toast.add({
                    title: "Export complete",
                    type: "success",
                    description: `Server responded ${response.status}`,
                });
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `jobs-${status.toLowerCase()}-${Date.now()}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            toast.add({
                title: "Export complete",
                type: "success",
                description: "Job data has been exported.",
            });

            resetForm();
            onClose();
        } catch (error) {
            toast.add({
                title: "Export failed",
                type: "error",
                description: `Error exporting data: ${error}`,
            });
        } finally {
            setExporting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                    <DialogDescription>
                        Export job data based on status and creation date range.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">
                            Status
                        </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as JobStatus)}
                            disabled={exporting}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                        >
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">
                                Created From
                            </label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                max={endDate || undefined}
                                disabled={exporting}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">
                                Created To
                            </label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate || undefined}
                                disabled={exporting}
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="default" onClick={handleExport} disabled={exporting}>
                        {exporting ? "Exporting..." : "Export"}
                    </Button>
                    <Button variant="secondary" onClick={handleCancel} disabled={exporting}>
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}