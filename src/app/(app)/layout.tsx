"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Camera, FolderKanban, LayoutGrid, Sparkles } from "lucide-react";
import { PersonaSwitch } from "@/components/app/persona-switch";

const tabs = [
  { href: "/capture", label: "Capture", icon: Camera },
  { href: "/feed", label: "Feed", icon: Sparkles },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/inbox", label: "Inbox", icon: Bell },
  { href: "/more", label: "More", icon: LayoutGrid },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pb-24">
      <div className="page-shell">
        <header className="mb-6 flex items-start justify-between gap-4 pt-2">
          <div>
            <p className="text-kicker mb-2 text-xs text-[var(--teal-400)]">FieldFirst</p>
            <h1 className="font-mono text-3xl font-semibold tracking-tight">System of action</h1>
            <p className="mt-2 max-w-md text-sm leading-6 text-[var(--sand-200)]">
              Capture once. Classify, route, escalate, and audit without losing the jobsite context.
            </p>
          </div>
          <PersonaSwitch />
        </header>

        <main>{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto mb-3 flex w-[calc(100%-1rem)] max-w-xl justify-between rounded-[28px] border border-white/10 bg-[rgba(18,19,17,0.92)] p-2 shadow-2xl backdrop-blur md:left-1/2 md:-translate-x-1/2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`touch-target flex flex-1 flex-col items-center justify-center rounded-[22px] px-2 py-2 text-xs transition ${
                active
                  ? "bg-[var(--teal-500)] text-[var(--ink-950)]"
                  : "text-[var(--sand-200)] hover:bg-white/5"
              }`}
            >
              <Icon className="mb-1 h-4 w-4" />
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
