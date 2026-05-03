"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface AISummaryProps {
  summary: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function AISummary({ summary, onRegenerate, isRegenerating }: AISummaryProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = parseSummaryIntoSections(summary);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">AI Summary</h2>
          <p className="text-sm text-zinc-400">Generated from your daily notes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <svg className="w-4 h-4 mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy
              </>
            )}
          </Button>
          {onRegenerate && (
            <Button variant="secondary" size="sm" onClick={onRegenerate} isLoading={isRegenerating}>
              <svg className="w-4 h-4 mr-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 2v6h-6M3 12a9 9 0 0115-6.7L21 8M3 22v-6h6M21 12a9 9 0 01-15 6.7L3 16" />
              </svg>
              Regenerate
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {sections.map((section, index) => (
          <div key={index}>
            <h3 className="text-sm font-medium text-cyan-400 mb-2 flex items-center">
              <span className="w-6 h-6 rounded bg-cyan-500/20 flex items-center justify-center mr-2 text-xs">
                {index + 1}
              </span>
              {section.title}
            </h3>
            <ul className="space-y-1 ml-8">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-sm text-zinc-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function parseSummaryIntoSections(summary: string): { title: string; items: string[] }[] {
  const sections: { title: string; items: string[] }[] = [];
  const lines = summary.split("\n").filter((line) => line.trim());

  let currentSection: { title: string; items: string[] } | null = null;

  for (const line of lines) {
    const cleanLine = line.replace(/^[#*\d.]+\s*/, "").trim();

    if (cleanLine.toLowerCase().includes("accomplishments") || cleanLine.toLowerCase().includes("achieved")) {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: "Accomplishments", items: [] };
    } else if (cleanLine.toLowerCase().includes("challenges") || cleanLine.toLowerCase().includes("obstacles")) {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: "Challenges", items: [] };
    } else if (cleanLine.toLowerCase().includes("next week") || cleanLine.toLowerCase().includes("goals") || cleanLine.toLowerCase().includes("plans")) {
      if (currentSection) sections.push(currentSection);
      currentSection = { title: "Next Week Goals", items: [] };
    } else if (currentSection && cleanLine) {
      const item = cleanLine.replace(/^[-•]\s*/, "");
      if (item) currentSection.items.push(item);
    }
  }

  if (currentSection) sections.push(currentSection);

  if (sections.length === 0 && summary) {
    sections.push({
      title: "Summary",
      items: summary.split("\n").filter((line) => line.trim()),
    });
  }

  return sections;
}