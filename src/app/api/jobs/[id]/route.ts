import { NextRequest, NextResponse } from "next/server";
import {JobUpdateData, prisma} from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const job = await prisma.job.findUnique({
      where: { id: BigInt(id) },
      include: {
        category: true,
        approvedByUser: { select: { name: true } },
        receivedByUser: { select: { name: true } },
        handledByUser: { select: { name: true } },
        sentBackByUser: { select: { name: true } },
        completedByUser: { select: { name: true } },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...job,
      id: job.id.toString(),
    });
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return NextResponse.json(
      { error: "Failed to fetch job" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { action, ...data } = body;

    let updateData: JobUpdateData;

    switch (action) {
      case "approve":
        updateData = {
          approvedBy: session.userId,
          approvedOn: new Date(),
        };
        break;
      case "receive":
        updateData = {
          receivedBy: session.userId,
          receivedOn: new Date(),
        };
        break;
      case "handle":
        updateData = {
          handledBy: parseInt(data.handledBy),
          handledOn: new Date(data.handledOn),
          result: data.result,
          actionTakenByTC: data.actionTakenByTC,
        };
        break;
      case "sendback":
        updateData = {
          sentBackBy: parseInt(data.sentBackBy),
          sendBackOn: new Date(data.sendBackOn),
          awbNumber: data.awbNumber,
        };
        break;
      case "complete":
        updateData = {
          completedBy: session.userId,
          completedOn: new Date(),
        };
        break;
      case "reset-approve":
        updateData = {
          approvedBy: null,
          approvedOn: null,
        };
        break;
      case "reset-receive":
        updateData = {
          receivedBy: null,
          receivedOn: null,
        };
        break;
      case "reset-handle":
        updateData = {
          handledBy: null,
          handledOn: null,
          result: null,
          actionTakenByTC: null,
        };
        break;
      case "reset-sendback":
        updateData = {
          sentBackBy: null,
          sendBackOn: null,
          awbNumber: null,
        };
        break;
      case "reset-complete":
        updateData = {
          completedBy: null,
          completedOn: null,
        };
        break;
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    const job = await prisma.job.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Failed to update job:", error);
    return NextResponse.json(
      { error: "Failed to update job" },
      { status: 500 }
    );
  }
}
