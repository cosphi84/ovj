import { JobRequest} from "@/interface/job";

export function RequestJobBodyMail(job: JobRequest) :string {
    const html: string = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
    <p>
        Sebuah request transfer job ke TC sudah dibuat dengan data berikut:
    </p>

    <table style="
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
        font-size: 14px;
    ">
        <thead>
            <tr>
                ${[
        "Job #",
        "Category",
        "Notification",
        "Model",
        "Serial Number",
        "Symptom",
        "Sender",
    ]
        .map(
            (header) => `
                            <th style="
                                background-color: #e5e7eb;
                                border: 1px solid #d1d5db;
                                padding: 10px;
                                text-align: left;
                                white-space: nowrap;
                            ">
                                ${header}
                            </th>
                        `,
        )
        .join("")}
            </tr>
        </thead>

        <tbody>
            <tr>
                <td style="border: 1px solid #d1d5db; padding: 10px;">${job.id}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px;">${job.notification}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px;">${job.model}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px;">${job.serialNumber}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px;">${job.symptom}</td>
                <td style="border: 1px solid #d1d5db; padding: 10px;">${job.sender}</td>
            </tr>
        </tbody>
    </table>

    <p>
        Mohon segera dicek dan diberikan keputusan apakah request tersebut
        akan <strong>disetujui (approved)</strong> atau <strong>ditolak</strong>.
    </p>

    <p style="
        margin-top: 25px;
        padding: 12px;
        background-color: #f3f4f6;
        border-left: 4px solid #9ca3af;
        color: #555;
    ">
        <strong>Note:</strong> Email ini dikirim oleh sistem dan tidak perlu dibalas.
    </p>

    <p style="margin-top: 25px; font-weight: bold;">
        TC Overjob System
    </p>

</div>
    `;

    return html;
}

