"use client";

import { useEffect, useState } from "react";
import { Navigation, MobileFAB } from "@/components/Navigation";
import { ReportCard } from "@/components/ReportCard";

interface Report {
  id: string;
  weekStart: string;
  weekEnd: string;
  status: string;
  aiSummary: string | null;
}

export default function DashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-4">
      <header className="sticky top-0 z-10 bg-background-primary/95 backdrop-blur border-b border-zinc-800 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Weekly Reports</h1>
            <p className="text-sm text-zinc-400">Your task summaries</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
              <svg className="w-8 h-8 text-zinc-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-zinc-300 mb-2">No reports yet</h2>
            <p className="text-sm text-zinc-500 mb-4">Start by adding your daily tasks</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                id={report.id}
                weekStart={report.weekStart}
                weekEnd={report.weekEnd}
                status={report.status}
                taskCount={0}
                aiSummary={report.aiSummary}
              />
            ))}
          </div>
        )}
      </main>

      <MobileFAB />
      <Navigation />
    </div>
  );
}