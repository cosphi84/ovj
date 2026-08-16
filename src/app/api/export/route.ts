import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get("active") === "true";

    const where: any = {};
    if (active) {
      where.completedOn = null;
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        category: { select: { name: true } },
        approvedByUser: { select: { name: true } },
        receivedByUser: { select: { name: true } },
        handledByUser: { select: { name: true } },
        sentBackByUser: { select: { name: true } },
        completedByUser: { select: { name: true } },
      },
      orderBy: { requestOn: "desc" },
    });

    const headers = [
      "ID",
      "Category",
      "Notification",
      "Model",
      "Serial Number",
      "Symptom",
      "Actions",
      "Changed Parts",
      "Sender",
      "Request By",
      "Request On",
      "Approved By",
      "Approved On",
      "Received By",
      "Received On",
      "Handled By",
      "Handled On",
      "Result",
      "Action Taken",
      "Send Back By",
      "Send Back On",
      "AWB Number",
      "Completed By",
      "Completed On",
    ];

    const rows = jobs.map((job: any) => [
      job.id.toString(),
      job.category.name,
      job.notification,
      job.model || "",
      job.serialNumber || "",
      job.symptom,
      job.actions,
      job.changedParts || "",
      job.sender,
      job.requestBy,
      new Date(job.requestOn).toLocaleString(),
      job.approvedByUser?.name || "",
      job.approvedOn ? new Date(job.approvedOn).toLocaleString() : "",
      job.receivedByUser?.name || "",
      job.receivedOn ? new Date(job.receivedOn).toLocaleString() : "",
      job.handledByUser?.name || "",
      job.handledOn ? new Date(job.handledOn).toLocaleString() : "",
      job.result || "",
      job.actionTakenByTC || "",
      job.sentBackByUser?.name || "",
      job.sendBackOn ? new Date(job.sendBackOn).toLocaleString() : "",
      job.awbNumber || "",
      job.completedByUser?.name || "",
      job.completedOn ? new Date(job.completedOn).toLocaleString() : "",
    ]);

    const csv =
      headers.map((h: string) => `"${h}"`).join(",") +
      "\n" +
      rows.map((row: any[]) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="jobs.csv"`,
      },
    });
  } catch (error) {
    console.error("Failed to export:", error);
    return NextResponse.json(
      { error: "Failed to export" },
      { status: 500 }
    );
  }
}
