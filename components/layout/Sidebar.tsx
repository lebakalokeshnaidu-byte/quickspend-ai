"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UploadCloud,
  Receipt,
  Flame,
  TrendingUp,
  Clock,
  RefreshCw,
  Settings,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/import", label: "Import", icon: UploadCloud },
      { href: "/orders", label: "Orders", icon: Receipt },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/insights/impulse-tax", label: "Impulse Tax", icon: Flame },
      { href: "/insights/price-creep", label: "Price Creep", icon: TrendingUp },
      { href: "/insights/time-patterns", label: "Time Patterns", icon: Clock },
    ],
  },
  {
    items: [
      { href: "/recurring", label: "Recurring", icon: RefreshCw },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/[0.06] bg-black/20 px-4 py-6 lg:flex">
      <Link href="/dashboard" className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple to-accent-lime shadow-glow">
          <Zap className="h-4 w-4 text-black" strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-white">QuickSpend AI</p>
          <p className="text-[10px] leading-tight text-white/40">Spend intelligence</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-6">
        {NAV_SECTIONS.map((section, idx) => (
          <div key={idx}>
            {section.label ? (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                {section.label}
              </p>
            ) : null}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(item.href + "/");
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/[0.07] text-white"
                        : "text-white/50 hover:bg-white/[0.04] hover:text-white/85",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 transition-colors",
                        active ? "text-accent-lime" : "text-white/40 group-hover:text-white/70",
                      )}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="glass-panel mt-4 p-3.5">
        <p className="text-xs font-medium text-white/80">MVP mode</p>
        <p className="mt-1 text-[11px] leading-relaxed text-white/40">
          Running on seed data. Connect Supabase to persist real orders.
        </p>
      </div>
    </aside>
  );
}
