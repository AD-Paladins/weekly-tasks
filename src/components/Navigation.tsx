"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function EntryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function AdminIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 7h8l-6.5 5 2.5 8-7-4.5-7 4.5 2.5-8L1 9h8l3-7z" />
    </svg>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navItems = [
    { href: "/dashboard", label: "Reports", icon: DashboardIcon },
    { href: "/entry", label: "Entry", icon: EntryIcon },
    ...(session?.user?.role === "ADMIN" ? [{ href: "/admin", label: "Admin", icon: AdminIcon }] : []),
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur border-t border-zinc-800 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="flex justify-around md:justify-start md:gap-2 md:px-4 md:py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-3 px-4 md:px-3 md:py-2 rounded-lg transition-colors min-w-[64px] md:min-w-auto",
                isActive
                  ? "text-cyan-400 bg-cyan-500/10"
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
              )}
            >
              <item.icon className="w-5 h-5 mb-1 md:mb-0 md:mr-2" />
              <span className="text-xs md:text-sm md:hidden">{item.label}</span>
              <span className="text-xs hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex flex-col items-center justify-center py-3 px-4 md:px-3 md:py-2 rounded-lg transition-colors text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 min-w-[64px] md:min-w-auto"
        >
          <svg className="w-5 h-5 mb-1 md:mb-0 md:mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          <span className="text-xs md:text-sm md:hidden">Logout</span>
          <span className="text-xs hidden md:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}

export function MobileFAB() {
  return (
    <Link
      href="/entry"
      className="fixed bottom-20 md:bottom-4 right-4 md:right-auto md:left-4 bg-cyan-500 hover:bg-cyan-400 text-black p-4 rounded-full shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 z-40"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </Link>
  );
}