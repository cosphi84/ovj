import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { prisma, Prisma } from "@/lib/db";

const jobInclude = {
  category: { select: { name: true } },
  approvedByUser: { select: { name: true } },
  receivedByUser: { select: { name: true } },
  handledByUser: { select: { name: true } },
  sentBackByUser: { select: { name: true } },
  completedByUser: { select: { name: true } },
} satisfies Prisma.JobInclude;

type JobWithRelations = Prisma.JobGetPayload<{ include: typeof jobInclude }>;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get("active") === "true";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const where: Prisma.JobWhereInput = {};
    if (active) {
      where.completedOn = null;
    }
    if (startDate || endDate) {
      where.requestOn = {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(`${endDate}T23:59:59.999`) } : {}),
      };
    }

    const jobs: JobWithRelations[] = await prisma.job.findMany({
      where,
      include: jobInclude,
      orderBy: { requestOn: "desc" },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "Overjob";
    workbook.created = new Date();

    const sheet = workbook.addWorksheet(active ? "Active Jobs" : "Completed Jobs");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Category", key: "category", width: 16 },
      { header: "Notification", key: "notification", width: 22 },
      { header: "Model", key: "model", width: 16 },
      { header: "Serial Number", key: "serialNumber", width: 18 },
      { header: "Symptom", key: "symptom", width: 26 },
      { header: "Actions", key: "actions", width: 26 },
      { header: "Changed Parts", key: "changedParts", width: 22 },
      { header: "Sender", key: "sender", width: 16 },
      { header: "Request By", key: "requestBy", width: 16 },
      { header: "Request On", key: "requestOn", width: 20 },
      { header: "Approved By", key: "approvedBy", width: 16 },
      { header: "Approved On", key: "approvedOn", width: 20 },
      { header: "Received By", key: "receivedBy", width: 16 },
      { header: "Received On", key: "receivedOn", width: 20 },
      { header: "Handled By", key: "handledBy", width: 16 },
      { header: "Handled On", key: "handledOn", width: 20 },
      { header: "Result", key: "result", width: 20 },
      { header: "Action Taken", key: "actionTaken", width: 22 },
      { header: "Send Back By", key: "sendBackBy", width: 16 },
      { header: "Send Back On", key: "sendBackOn", width: 20 },
      { header: "AWB Number", key: "awbNumber", width: 18 },
      { header: "Completed By", key: "completedBy", width: 16 },
      { header: "Completed On", key: "completedOn", width: 20 },
    ];

    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" },
    };

    for (const job of jobs) {
      sheet.addRow({
        id: job.id.toString(),
        category: job.category.name,
        notification: job.notification,
        model: job.model || "",
        serialNumber: job.serialNumber || "",
        symptom: job.symptom,
        actions: job.actions,
        changedParts: job.changedParts || "",
        sender: job.sender,
        requestBy: job.requestBy,
        requestOn: job.requestOn ? new Date(job.requestOn) : null,
        approvedBy: job.approvedByUser?.name || "",
        approvedOn: job.approvedOn ? new Date(job.approvedOn) : null,
        receivedBy: job.receivedByUser?.name || "",
        receivedOn: job.receivedOn ? new Date(job.receivedOn) : null,
        handledBy: job.handledByUser?.name || "",
        handledOn: job.handledOn ? new Date(job.handledOn) : null,
        result: job.result || "",
        actionTaken: job.actionTakenByTC || "",
        sendBackBy: job.sentBackByUser?.name || "",
        sendBackOn: job.sendBackOn ? new Date(job.sendBackOn) : null,
        awbNumber: job.awbNumber || "",
        completedBy: job.completedByUser?.name || "",
        completedOn: job.completedOn ? new Date(job.completedOn) : null,
      });
    }

    const dateColumns = [
      "requestOn",
      "approvedOn",
      "receivedOn",
      "handledOn",
      "sendBackOn",
      "completedOn",
    ] as const;
    for (const key of dateColumns) {
      sheet.getColumn(key).numFmt = "yyyy-mm-dd hh:mm";
    }

    sheet.views = [{ state: "frozen", ySplit: 1 }];

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="jobs-${active ? "active" : "completed"}-${Date.now()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Failed to export:", error);
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}