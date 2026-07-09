import { formatCurrency } from "@/lib/utils";

interface CategorySpend {
  category: string;
  amount: number;
}

export function ImpulseCategories({ categories }: { categories: CategorySpend[] }) {
  const max = Math.max(...categories.map((c) => c.amount), 1);
  return (
    <div className="flex flex-col gap-4">
      {categories.map((cat) => (
        <div key={cat.category}>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-white/70">{cat.category}</span>
            <span className="font-medium text-white">{formatCurrency(cat.amount)}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-lime"
              style={{ width: `${Math.max((cat.amount / max) * 100, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
