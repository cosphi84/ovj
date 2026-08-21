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
    const handleSubmit = () => {
        console.log("Handle job:", job.id);

        // nanti di sini bisa melakukan patchJob()
        // setelah berhasil:
        onOpenChange(false);
    };

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
                    Isi form untuk melakukan handle job di sini.
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button onClick={handleSubmit}>
                        Handle
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}