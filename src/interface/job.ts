export interface Job {
    id: bigint;

    notification: string;

    category: {
        name: string;
    };

    model: string | null;
    serialNumber: string | null;
    symptom: string;
    actions: string;
    changedParts: string | null;

    sender: string;
    requestBy: string;
    requestOn: Date;

    approvedBy: number | null;
    approvedByUser?: {
        name: string;
    } | null;
    approvedOn: Date | null;

    receivedBy: number | null;
    receivedByUser?: {
        name: string;
    } | null;
    receivedOn: Date | null;

    handledBy: number | null;
    handledByUser?: {
        name: string;
    } | null;
    handledOn: Date | null;

    actionTakenByTC: string | null;
    result: string | null;

    sentBackBy: number | null;
    sentBackByUser?: {
        name: string;
    } | null;
    sendBackOn: Date | null;

    awbNumber: string | null;

    completedBy: number | null;
    completedByUser?: {
        name: string;
    } | null;
    completedOn: Date | null;
}

export interface JobState {
    canApprove: boolean;
    canReceive: boolean;
    canAssign: boolean;
    canHandle: boolean;
    canSendBack: boolean;
    canComplete: boolean;
}

export interface JobRequest {
    id: bigint;
    notification: string;
    model: string | null;
    serialNumber: string | null;
    symptom: string;
    actions: string;
    changedParts: string | null;
    sender: string;
    requestBy: string;
    requestOn: Date;
}

export interface JobResponse {
    id: string;
    notification: string;
    category: { name: string };
    model: string | null;
    serialNumber: string | null;
    symptom: string;
    sender: string;
    result: string | null;
    approvedOn: Date | null;
    receivedOn: Date | null;
    handledByUser?: {
        name: string;
    } | null;
    handledOn: Date | null;
    sendBackOn: Date | null;
    completedOn: Date | null;
}