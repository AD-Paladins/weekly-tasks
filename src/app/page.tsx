import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await getAuthSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-zinc-50 tracking-tight">TaskFlow</h1>
          <p className="text-lg text-zinc-400">Weekly task reporting for developers</p>
        </div>

        <div className="card p-6 space-y-4">
          <p className="text-zinc-300 text-sm">
            Log your daily bullet points and let AI generate professional weekly summaries.
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/login" className="btn-primary w-full py-3 text-center block">
              Sign In
            </Link>
            <Link href="/register" className="btn-secondary w-full py-3 text-center block">
              Register
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