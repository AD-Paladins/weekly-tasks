import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { getWeekStart, getWeekEnd } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, date } = body;

    if (!content || !date) {
      return NextResponse.json(
        { error: "Content and date are required" },
        { status: 400 }
      );
    }

    const taskDate = new Date(date);
    const weekStart = getWeekStart(taskDate);
    const weekEnd = getWeekEnd(taskDate);

    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        content,
        date: taskDate,
      },
    });

    let weeklyReport = await prisma.weeklyReport.findUnique({
      where: {
        userId_weekStart: {
          userId: session.user.id,
          weekStart,
        },
      },
    });

    if (!weeklyReport) {
      weeklyReport = await prisma.weeklyReport.create({
        data: {
          userId: session.user.id,
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
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    const where: Record<string, unknown> = { userId: session.user.id };

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