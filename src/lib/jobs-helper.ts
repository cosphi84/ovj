import {Job, JobState} from "@/interface/job";

export default function getJobState(job: Job) : JobState{
    const steps = [
        job.approvedOn,
        job.receivedOn,
        job.handledBy,
        job.handledOn,
        job.sendBackOn,
        job.completedOn,
    ].map(d => d !== null);

    return {
        canApprove:  !steps[0],
        canReceive:  steps.slice(0, 1).every(Boolean) && !steps[1],
        canAssign: steps.slice(0, 2).every(Boolean) && !steps[2],
        canHandle:   steps.slice(0, 3).every(Boolean) && !steps[3],
        canSendBack: steps.slice(0, 4).every(Boolean) && !steps[4],
        canComplete: steps.slice(0, 5).every(Boolean) && !steps[5],
    };
}