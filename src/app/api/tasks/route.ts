import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWeekStart, getWeekEnd, formatDate } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, date, userId } = body;

    if (!content || !date) {
      return NextResponse.json(
        { error: "Content and date are required" },
        { status: 400 }
      );
    }

    const taskDate = new Date(date);
    const weekStart = getWeekStart(taskDate);
    const weekEnd = getWeekEnd(taskDate);

    const userIdToUse = userId || "default-user-id";

    let user = await prisma.user.findUnique({
      where: { id: userIdToUse },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userIdToUse,
          email: "developer@taskflow.app",
          name: "Developer",
        },
      });
    }

    const task = await prisma.task.create({
      data: {
        userId: user.id,
        content,
        date: taskDate,
      },
    });

    let weeklyReport = await prisma.weeklyReport.findUnique({
      where: {
        userId_weekStart: {
          userId: user.id,
          weekStart,
        },
      },
    });

    if (!weeklyReport) {
      weeklyReport = await prisma.weeklyReport.create({
        data: {
          userId: user.id,
          weekStart,
          weekEnd,
          status: "draft",
        },
      });
    }

    return NextResponse.json({
      task,
      reportId: weeklyReport.id,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "default-user-id";
    const date = searchParams.get("date");

    const where: Record<string, unknown> = { userId };

    if (date) {
      const taskDate = new Date(date);
      const weekStart = getWeekStart(taskDate);
      const weekEnd = getWeekEnd(taskDate);
      where.date = {
        gte: weekStart,
        lte: weekEnd,
      };
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { date: "desc" },
      take: 50,
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}