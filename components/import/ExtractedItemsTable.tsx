"use client";

import { Plus, Trash2 } from "lucide-react";
import { CLASSIFICATION_LABELS, type ExtractedItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

let localIdCounter = 0;

export function ExtractedItemsTable({
  items,
  onChange,
}: {
  items: ExtractedItem[];
  onChange: (items: ExtractedItem[]) => void;
}) {
  function updateItem(id: string, patch: Partial<ExtractedItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeItem(id: string) {
    onChange(items.filter((it) => it.id !== id));
  }

  function addItem() {
    localIdCounter += 1;
    onChange([
      ...items,
      {
        id: `manual_${localIdCounter}`,
        name: "New item",
        category_name: "Uncategorized",
        classification: "Unclear",
        unit_price: 0,
        quantity: 1,
        confidence: 1,
      },
    ]);
  }

  const total = items.reduce((s, it) => s + it.unit_price * it.quantity, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="scrollbar-thin overflow-x-auto rounded-2xl border border-white/[0.08]">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-white/[0.02] text-left text-xs uppercase tracking-wide text-white/40">
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Classification</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Unit price</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2.5">
                  <input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    className="w-full min-w-[160px] rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-white/85 hover:border-white/10 focus:border-accent-purple/50 focus:bg-white/[0.03] focus:outline-none"
                  />
                  <p className="px-2 text-[11px] text-white/30">{item.category_name}</p>
                </td>
                <td className="px-4 py-2.5">
                  <select
                    value={item.classification}
                    onChange={(e) => updateItem(item.id, { classification: e.target.value as ExtractedItem["classification"] })}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-xs text-white/80 focus:border-accent-purple/50 focus:outline-none"
                  >
                    {CLASSIFICATION_LABELS.map((label) => (
                      <option key={label} value={label} className="bg-base-800">
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 1 })}
                    className="w-16 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-white/85 hover:border-white/10 focus:border-accent-purple/50 focus:bg-white/[0.03] focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    min={0}
                    value={item.unit_price}
                    onChange={(e) => updateItem(item.id, { unit_price: Number(e.target.value) || 0 })}
                    className="w-24 rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-white/85 hover:border-white/10 focus:border-accent-purple/50 focus:bg-white/[0.03] focus:outline-none"
                  />
                </td>
                <td className="px-4 py-2.5 text-xs text-white/40">{Math.round(item.confidence * 100)}%</td>
                <td className="px-4 py-2.5 text-right">
                  <button onClick={() => removeItem(item.id)} className="text-white/30 hover:text-orange-300">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 text-xs font-medium text-white/50 hover:text-white/85"
        >
          <Plus className="h-3.5 w-3.5" /> Add item
        </button>
        <p className="text-sm text-white/70">
          Total: <span className="font-semibold text-white">{formatCurrency(total)}</span>
        </p>
      </div>
    </div>
  );
}
