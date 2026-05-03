"use client";

import { Navigation } from "@/components/Navigation";
import { QuickEntry } from "@/components/QuickEntry";

export default function EntryPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-4">
      <header className="sticky top-0 z-10 bg-background-primary/95 backdrop-blur border-b border-zinc-800 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-zinc-100">Quick Entry</h1>
          <p className="text-sm text-zinc-400">Add your daily tasks</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <QuickEntry />
      </main>

      <Navigation />
    </div>
  );
}