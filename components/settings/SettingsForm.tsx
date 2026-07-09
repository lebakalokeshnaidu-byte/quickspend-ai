"use client";

import { useState } from "react";
import { Mail, Share2 } from "lucide-react";
import type { Platform } from "@/lib/types";
import { Card, CardHeader } from "@/components/ui/Card";
import { Toggle } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { PlatformBadge } from "@/components/ui/Badge";

export function SettingsForm({ platforms }: { platforms: Platform[] }) {
  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(platforms.map((p) => [p.id, true])),
  );
  const [prefs, setPrefs] = useState({
    autoClassify: true,
    priceCreepAlerts: true,
    lateNightNudges: true,
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Profile" subtitle="Basic account details" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/45">Name</label>
            <input
              defaultValue="You"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-accent-purple/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/45">Email</label>
            <input
              defaultValue="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white focus:border-accent-purple/50 focus:outline-none"
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Connected platforms" subtitle="Where QuickSpend AI is tracking spend" />
        <div className="flex flex-col divide-y divide-white/[0.06]">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <PlatformBadge name={platform.name} color={platform.color} />
              <Toggle
                checked={connected[platform.id] ?? false}
                onChange={(v) => setConnected((prev) => ({ ...prev, [platform.id]: v }))}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Preferences" />
        <div className="flex flex-col divide-y divide-white/[0.06]">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <div>
              <p className="text-sm text-white/85">Auto-classify imported items</p>
              <p className="mt-0.5 text-xs text-white/35">Apply mock OCR classification labels automatically</p>
            </div>
            <Toggle checked={prefs.autoClassify} onChange={(v) => setPrefs((p) => ({ ...p, autoClassify: v }))} />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm text-white/85">Price creep alerts</p>
              <p className="mt-0.5 text-xs text-white/35">Notify when a repeat item's price rises</p>
            </div>
            <Toggle
              checked={prefs.priceCreepAlerts}
              onChange={(v) => setPrefs((p) => ({ ...p, priceCreepAlerts: v }))}
            />
          </div>
          <div className="flex items-center justify-between py-3 last:pb-0">
            <div>
              <p className="text-sm text-white/85">Late-night ordering nudges</p>
              <p className="mt-0.5 text-xs text-white/35">Gentle nudge when ordering between 11pm–5am</p>
            </div>
            <Toggle
              checked={prefs.lateNightNudges}
              onChange={(v) => setPrefs((p) => ({ ...p, lateNightNudges: v }))}
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Upcoming integrations" subtitle="Not wired up yet in this MVP" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
            <Mail className="h-5 w-5 shrink-0 text-white/40" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white/80">Gmail order import</p>
              <p className="text-xs text-white/35">
                TODO(gmail-import): OAuth into Gmail and parse order confirmation emails automatically.
              </p>
            </div>
            <Button variant="secondary" size="sm" disabled>
              Connect
            </Button>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
            <Share2 className="h-5 w-5 shrink-0 text-white/40" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-white/80">Native share-sheet import</p>
              <p className="text-xs text-white/35">
                TODO(native-share): register as a native share target so order receipts can be
                shared directly from the Blinkit/Zepto/Instamart/BigBasket apps.
              </p>
            </div>
            <Button variant="secondary" size="sm" disabled>
              Enable
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Data & privacy" />
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" size="sm">
            Export my data
          </Button>
          <Button variant="secondary" size="sm" className="text-orange-300 hover:text-orange-200" disabled>
            Clear all data
          </Button>
        </div>
      </Card>
    </div>
  );
}
