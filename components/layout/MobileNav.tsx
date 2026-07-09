"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UploadCloud, Receipt, Flame, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/import", label: "Import", icon: UploadCloud },
  { href: "/orders", label: "Orders", icon: Receipt },
  { href: "/insights/impulse-tax", label: "Insights", icon: Flame },
  { href: "/recurring", label: "Recurring", icon: RefreshCw },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-white/[0.08] bg-black/70 backdrop-blur-xl lg:hidden">
      {ITEMS.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
              active ? "text-accent-lime" : "text-white/45",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
