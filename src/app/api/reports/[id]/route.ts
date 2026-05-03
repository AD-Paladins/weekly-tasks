import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const report = await prisma.weeklyReport.findUnique({
      where: { id },
    });

    if (!report) {
      return NextResponse.json(
        { error: "Report not found" },
        { status: 404 }
      );
    }

    const weekStart = new Date(report.weekStart);
    const weekEnd = new Date(report.weekEnd);
    weekEnd.setHours(23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
      where: {
        userId: report.userId,
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({
      ...report,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}