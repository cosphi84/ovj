import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const active = searchParams.get("active") === "true";
    const search = searchParams.get("q");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (active) {
      where.completedOn = null;
    }

    if (search) {
      where.OR = [
        { notification: { contains: search, mode: "insensitive" } },
        { model: { contains: search, mode: "insensitive" } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        select: {
          id: true,
          notification: true,
          category: { select: { name: true } },
          model: true,
          serialNumber: true,
          symptom: true,
          sender: true,
          handledByUser: { select: { name: true } },
        },
        skip,
        take: limit,
        orderBy: { requestOn: "desc" },
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({
      jobs: jobs.map((job: any) => ({
        ...job,
        id: job.id.toString(),
      })),
      total,
    });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      categoryId,
      notification,
      model,
      serialNumber,
      symptom,
      actions,
      changedParts,
      sender,
      requestBy,
    } = body;

    if (
      !categoryId ||
      !notification ||
      !symptom ||
      !actions ||
      !sender ||
      !requestBy
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const job = await prisma.job.create({
      data: {
        categoryId: parseInt(categoryId),
        notification,
        model,
        serialNumber,
        symptom,
        actions,
        changedParts,
        sender,
        requestBy,
        requestOn: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      job: {
        ...job,
        id: job.id.toString(),
      },
    });
  } catch (error: any) {
    console.error("Failed to create job:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Notification number already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
