"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { getWeekRangeString } from "@/lib/utils";

interface ReportCardProps {
  id: string;
  weekStart: Date | string;
  weekEnd: Date | string;
  status: string;
  taskCount?: number;
  aiSummary?: string | null;
}

const statusStyles = {
  draft: "bg-zinc-700 text-zinc-300",
  pending: "bg-amber-500/20 text-amber-400",
  completed: "bg-green-500/20 text-green-400",
};

const statusLabels = {
  draft: "Draft",
  pending: "Pending",
  completed: "Completed",
};

export function ReportCard({ id, weekStart, weekEnd, status, taskCount = 0, aiSummary }: ReportCardProps) {
  const start = new Date(weekStart);
  const end = new Date(weekEnd);
  const weekRange = getWeekRangeString(start, end);

  const summaryPreview = aiSummary
    ? aiSummary.split("\n").slice(0, 3).join(" ").slice(0, 120) + (aiSummary.length > 120 ? "..." : "")
    : "No AI summary generated yet";

  return (
    <Link href={`/report/${id}`}>
      <Card variant="interactive" className="h-full">
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-zinc-100">{weekRange}</h3>
              <p className="text-xs text-zinc-500">{start.getFullYear()}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[status as keyof typeof statusStyles] || statusStyles.draft}`}>
              {statusLabels[status as keyof typeof statusLabels] || status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <svg className="w-4 h-4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
            {taskCount} task{taskCount !== 1 ? "s" : ""}
          </div>

          <p className="text-sm text-zinc-400 line-clamp-2">{summaryPreview}</p>
        </CardContent>
      </Card>
    </Link>
  );
}