"use client";

import { useState, useEffect, useCallback } from "react";
import { Textarea } from "@/components/ui/Textarea";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";

const DRAFT_KEY = "taskflow_draft";

export function QuickEntry() {
  const [content, setContent] = useState("");
  const [date, setDate] = useState(formatDate(new Date()));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      const { content: savedContent, date: savedDate } = JSON.parse(draft);
      setContent(savedContent || "");
      setDate(savedDate || formatDate(new Date()));
    }
  }, []);

  const saveDraft = useCallback(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ content, date }));
  }, [content, date]);

  useEffect(() => {
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [saveDraft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), date }),
      });

      if (!response.ok) throw new Error("Failed to save task");

      const data = await response.json();
      setContent("");
      localStorage.removeItem(DRAFT_KEY);
      setMessage({ type: "success", text: "Task saved successfully!" });

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to save task. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const clearDraft = () => {
    setContent("");
    localStorage.removeItem(DRAFT_KEY);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-zinc-100">Quick Entry</h2>
        <p className="text-sm text-zinc-400">Add your daily tasks or notes</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            max={formatDate(new Date())}
          />
          <Textarea
            label="What did you work on?"
            placeholder="• Completed API endpoint for user authentication&#10;• Fixed bug in dashboard loading&#10;• Reviewed PR #123"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            charCount
            maxLength={2000}
            rows={6}
            required
          />
          {message && (
            <div
              className={`text-sm px-3 py-2 rounded-lg ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}
          <div className="flex gap-3">
            <Button type="submit" isLoading={isSaving} className="flex-1">
              Save Entry
            </Button>
            {content && (
              <Button type="button" variant="ghost" onClick={clearDraft}>
                Clear
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}