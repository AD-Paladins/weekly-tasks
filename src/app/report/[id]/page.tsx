"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { AISummary } from "@/components/AISummary";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getWeekRangeString } from "@/lib/utils";

interface Task {
  id: string;
  content: string;
  date: string;
}

interface Report {
  id: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  aiSummary: string | null;
  tasks: Task[];
}

export default function ReportPage() {
  const params = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchReport(params.id as string);
    }
  }, [params.id]);

  const fetchReport = async (id: string) => {
    try {
      const response = await fetch(`/api/reports/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data);
      }
    } catch (error) {
      console.error("Failed to fetch report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!report) return;

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekStart: report.weekStart,
          weekEnd: report.weekEnd,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReport((prev) => prev ? { ...prev, aiSummary: data.summary, status: "completed" } : null);
      }
    } catch (error) {
      console.error("Failed to generate summary:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">Report not found</p>
      </div>
    );
  }

  const weekStart = new Date(report.weekStart);
  const weekEnd = new Date(report.weekEnd);
  const weekRange = getWeekRangeString(weekStart, weekEnd);

  return (
    <div className="min-h-screen pb-20 md:pb-4">
      <header className="sticky top-0 z-10 bg-background-primary/95 backdrop-blur border-b border-zinc-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">{weekRange}</h1>
            <p className="text-sm text-zinc-400">{weekStart.getFullYear()}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            report.status === "completed" ? "bg-green-500/20 text-green-400" :
            report.status === "pending" ? "bg-amber-500/20 text-amber-400" :
            "bg-zinc-700 text-zinc-300"
          }`}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {report.aiSummary ? (
          <AISummary
            summary={report.aiSummary}
            onRegenerate={handleGenerateSummary}
            isRegenerating={isGenerating}
          />
        ) : (
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-zinc-100">Generate AI Summary</h2>
              <p className="text-sm text-zinc-400">
                Transform your {report.tasks.length} tasks into a professional summary
              </p>
            </CardHeader>
            <CardContent>
              <Button onClick={handleGenerateSummary} isLoading={isGenerating} className="w-full">
                <svg className="w-4 h-4 mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Generate Summary
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-zinc-100">Daily Tasks</h2>
            <p className="text-sm text-zinc-400">{report.tasks.length} entries this week</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.tasks.map((task) => (
                <div key={task.id} className="flex gap-3 p-3 rounded-lg bg-zinc-800/50">
                  <div className="w-20 flex-shrink-0 text-xs text-zinc-500">
                    {new Date(task.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </div>
                  <p className="text-sm text-zinc-300">{task.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Navigation />
    </div>
  );
}