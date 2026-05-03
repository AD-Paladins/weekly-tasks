import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-zinc-50 tracking-tight">
            TaskFlow
          </h1>
          <p className="text-lg text-zinc-400">
            Weekly task reporting for developers
          </p>
        </div>

        <div className="card p-6 space-y-4">
          <p className="text-zinc-300 text-sm">
            Log your daily bullet points and let AI generate professional weekly summaries.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="btn-primary w-full py-3 text-center block"
            >
              Get Started
            </Link>
            <Link
              href="/entry"
              className="btn-secondary w-full py-3 text-center block"
            >
              Quick Entry
            </Link>
          </div>
        </div>

        <div className="text-xs text-zinc-500 space-y-1">
          <p>Dark mode • Mobile-first • AI-powered</p>
        </div>
      </div>
    </main>
  );
}