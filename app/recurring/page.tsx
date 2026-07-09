import { RefreshCw, Info } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { PlatformBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getRecurringItems } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function RecurringPage() {
  const items = await getRecurringItems();
  const sorted = [...items].sort((a, b) => a.frequency_days - b.frequency_days);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Recurring"
        subtitle="Staples you reorder on a predictable rhythm — never run out, never over-order."
      />

      <div className="glass-panel mb-6 flex items-start gap-3 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-lime" />
        <p className="text-xs leading-relaxed text-white/50">
          TODO(native-share): once the native share-sheet target ships, "Reorder" will deep-link
          straight into the platform app with the basket pre-filled. For now this is a preview of
          what QuickSpend AI has learned about your repeat baskets.
        </p>
      </div>

      {sorted.length === 0 ? (
        <Card>
          <p className="text-sm text-white/40">No recurring patterns yet — import a few more orders to unlock this.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((item) => (
            <Card key={item.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-white/90">{item.item_name}</p>
                <RefreshCw className="h-4 w-4 shrink-0 text-accent-lime" />
              </div>
              <p className="mt-1 text-xs text-white/35">{item.category_name}</p>

              <div className="mt-3">
                <PlatformBadge name={item.platform.name} color={item.platform.color} />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-white/35">Frequency</p>
                  <p className="mt-0.5 font-medium text-white/85">every ~{item.frequency_days}d</p>
                </div>
                <div>
                  <p className="text-white/35">Avg price</p>
                  <p className="mt-0.5 font-medium text-white/85">{formatCurrency(item.avg_price)}</p>
                </div>
                <div>
                  <p className="text-white/35">Last ordered</p>
                  <p className="mt-0.5 font-medium text-white/85">{formatDate(item.last_ordered_at)}</p>
                </div>
                <div>
                  <p className="text-white/35">Next expected</p>
                  <p className="mt-0.5 font-medium text-accent-lime">{formatDate(item.next_expected_at)}</p>
                </div>
              </div>

              <Button variant="secondary" size="sm" className="mt-4 w-full" disabled>
                Reorder — coming soon
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
