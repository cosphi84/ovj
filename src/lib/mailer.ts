import nodemailer from "nodemailer";
import {EmailFormat} from "@/interface/mailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export async function sendEmail({ to, subject, html, text }: EmailFormat) {
    return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html,
    });
}