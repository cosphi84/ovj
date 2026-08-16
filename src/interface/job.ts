export interface Job {
    id: string;

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
    requestOn: string;

    approvedBy: number | null;
    approvedByUser?: {
        name: string;
    } | null;
    approvedOn: string | null;

    receivedBy: number | null;
    receivedByUser?: {
        name: string;
    } | null;
    receivedOn: string | null;

    handledBy: number | null;
    handledByUser?: {
        name: string;
    } | null;
    handledOn: string | null;

    actionTakenByTC: string | null;
    result: string | null;

    sentBackBy: number | null;
    sentBackByUser?: {
        name: string;
    } | null;
    sendBackOn: string | null;

    awbNumber: string | null;

    completedBy: number | null;
    completedByUser?: {
        name: string;
    } | null;
    completedOn: string | null;
}