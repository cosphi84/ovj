export interface EmailFormat {
    to: string;
    cc: string;
    subject: string;
    html?: string;
    text?: string;
}