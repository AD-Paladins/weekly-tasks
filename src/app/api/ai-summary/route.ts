import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function generateAISummary(tasks: { content: string; date: Date }[]): Promise<string> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4-turbo-preview";

  if (!openaiApiKey) {
    return generateFallbackSummary(tasks);
  }

  const taskList = tasks
    .map((t) => `- ${t.content} (${new Date(t.date).toLocaleDateString()})`)
    .join("\n");

  const prompt = `You are a professional development report assistant. Analyze the following daily task notes from a software developer and create a structured weekly summary.

Task Notes:
${taskList}

Generate a professional weekly summary with these sections:
1. **Accomplishments** - What was achieved this week
2. **Challenges** - Any obstacles or issues encountered
3. **Next Week Goals** - Planned priorities for the coming week

Keep each section concise and bullet-pointed. Use professional tone.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are an expert at creating professional weekly development summaries.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", await response.text());
      return generateFallbackSummary(tasks);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || generateFallbackSummary(tasks);
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return generateFallbackSummary(tasks);
  }
}

function generateFallbackSummary(tasks: { content: string; date: Date }[]): string {
  const tasksByDate: Record<string, string[]> = {};

  tasks.forEach((task) => {
    const dateKey = new Date(task.date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task.content);
  });

  let summary = "## Weekly Summary\n\n";

  summary += "### Accomplishments\n";
  tasks.forEach((task) => {
    summary += `- ${task.content}\n`;
  });

  summary += "\n### Challenges\n";
  summary += "- Ongoing development tasks in progress\n";

  summary += "\n### Next Week Goals\n";
  summary += "- Continue planned development work\n";
  summary += "- Address any pending items from this week\n";

  return summary;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekStart, weekEnd, userId } = body;

    if (!weekStart || !weekEnd) {
      return NextResponse.json(
        { error: "Week start and end dates are required" },
        { status: 400 }
      );
    }

    const userIdToUse = userId || "default-user-id";

    const startDate = new Date(weekStart);
    const endDate = new Date(weekEnd);
    endDate.setHours(23, 59, 59, 999);

    const tasks = await prisma.task.findMany({
      where: {
        userId: userIdToUse,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: "No tasks found for this week" },
        { status: 400 }
      );
    }

    const aiSummary = await generateAISummary(tasks);

    const report = await prisma.weeklyReport.findFirst({
      where: {
        userId: userIdToUse,
        weekStart: startDate,
      },
    });

    if (report) {
      await prisma.weeklyReport.update({
        where: { id: report.id },
        data: {
          aiSummary,
          status: "completed",
        },
      });
    }

    return NextResponse.json({
      summary: aiSummary,
      taskCount: tasks.length,
      reportId: report?.id,
    });
  } catch (error) {
    console.error("Error generating AI summary:", error);
    return NextResponse.json(
      { error: "Failed to generate AI summary" },
      { status: 500 }
    );
  }
}