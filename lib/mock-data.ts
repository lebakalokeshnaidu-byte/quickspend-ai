import type {
  Category,
  ClassificationLabel,
  ImportJob,
  Order,
  OrderItem,
  Platform,
  PlatformSlug,
  PriceCreepAlert,
  RecurringItem,
} from "./types";

// ---------------------------------------------------------------------------
// Static reference data
// ---------------------------------------------------------------------------

export const PLATFORMS: Record<PlatformSlug, Platform> = {
  blinkit: { id: "plat_blinkit", slug: "blinkit", name: "Blinkit", color: "#ffcc33" },
  zepto: { id: "plat_zepto", slug: "zepto", name: "Zepto", color: "#9b5cff" },
  instamart: { id: "plat_instamart", slug: "instamart", name: "Instamart", color: "#ff7a59" },
  bigbasket: { id: "plat_bigbasket", slug: "bigbasket", name: "BigBasket", color: "#5fd870" },
};

export const PLATFORM_LIST: Platform[] = Object.values(PLATFORMS);

export const CATEGORIES: Category[] = [
  { id: "cat_dairy", name: "Dairy & Bakery" },
  { id: "cat_snacks", name: "Snacks & Namkeen" },
  { id: "cat_beverages", name: "Beverages" },
  { id: "cat_desserts", name: "Ice Cream & Desserts" },
  { id: "cat_personal", name: "Personal Care" },
  { id: "cat_household", name: "Household Essentials" },
  { id: "cat_produce", name: "Fruits & Vegetables" },
  { id: "cat_staples", name: "Staples & Atta" },
  { id: "cat_frozen", name: "Instant & Frozen Food" },
  { id: "cat_baby", name: "Baby Care" },
];

interface CatalogEntry {
  category: string;
  classification: ClassificationLabel;
  base: number;
}

// Item catalog: name -> category / default classification / base unit price (INR)
export const ITEM_CATALOG: Record<string, CatalogEntry> = {
  "Amul Taaza Milk 500ml": { category: "Dairy & Bakery", classification: "Recurring Staple", base: 33 },
  "Britannia Brown Bread 400g": { category: "Dairy & Bakery", classification: "Recurring Staple", base: 45 },
  "Amul Butter 500g": { category: "Dairy & Bakery", classification: "Recurring Staple", base: 265 },
  "Nescafe Classic Coffee 100g": { category: "Beverages", classification: "Recurring Staple", base: 285 },
  "Maggi Noodles 4-pack": { category: "Instant & Frozen Food", classification: "Junk/Snack", base: 56 },
  "Lay's Classic Salted 52g": { category: "Snacks & Namkeen", classification: "Junk/Snack", base: 20 },
  "Haldiram's Bhujia 200g": { category: "Snacks & Namkeen", classification: "Junk/Snack", base: 65 },
  "Kurkure Masala Munch 90g": { category: "Snacks & Namkeen", classification: "Impulse Buy", base: 20 },
  "Bingo Mad Angles 72g": { category: "Snacks & Namkeen", classification: "Junk/Snack", base: 30 },
  "Cadbury Dairy Milk Silk": { category: "Ice Cream & Desserts", classification: "Impulse Buy", base: 199 },
  "Amul Ice Cream Tub 700ml": { category: "Ice Cream & Desserts", classification: "Impulse Buy", base: 249 },
  "Kwality Walls Cornetto": { category: "Ice Cream & Desserts", classification: "Impulse Buy", base: 60 },
  "Coca-Cola 750ml": { category: "Beverages", classification: "Impulse Buy", base: 45 },
  "Sprite 750ml": { category: "Beverages", classification: "Impulse Buy", base: 45 },
  "Red Bull 250ml": { category: "Beverages", classification: "Impulse Buy", base: 125 },
  "Real Fruit Juice 1L": { category: "Beverages", classification: "Planned Grocery", base: 110 },
  "Tata Salt 1kg": { category: "Staples & Atta", classification: "Recurring Staple", base: 28 },
  "Aashirvaad Atta 5kg": { category: "Staples & Atta", classification: "Recurring Staple", base: 275 },
  "Toor Dal 1kg": { category: "Staples & Atta", classification: "Planned Grocery", base: 165 },
  "Fortune Sunflower Oil 1L": { category: "Staples & Atta", classification: "Planned Grocery", base: 155 },
  "India Gate Basmati Rice 5kg": { category: "Staples & Atta", classification: "Planned Grocery", base: 449 },
  "Onions 1kg": { category: "Fruits & Vegetables", classification: "Planned Grocery", base: 38 },
  "Tomatoes 1kg": { category: "Fruits & Vegetables", classification: "Planned Grocery", base: 42 },
  "Bananas Dozen": { category: "Fruits & Vegetables", classification: "Planned Grocery", base: 55 },
  "Potatoes 1kg": { category: "Fruits & Vegetables", classification: "Planned Grocery", base: 30 },
  "Colgate Toothpaste 200g": { category: "Personal Care", classification: "Household Need", base: 95 },
  "Dove Soap 3-pack": { category: "Personal Care", classification: "Household Need", base: 180 },
  "Head & Shoulders Shampoo 340ml": { category: "Personal Care", classification: "Household Need", base: 299 },
  "Harpic Toilet Cleaner 1L": { category: "Household Essentials", classification: "Household Need", base: 150 },
  "Surf Excel 1kg": { category: "Household Essentials", classification: "Household Need", base: 210 },
  "Vim Dishwash Bar 3-pack": { category: "Household Essentials", classification: "Household Need", base: 60 },
  "Pampers Diapers Pack M": { category: "Baby Care", classification: "Household Need", base: 499 },
  "Cerelac Baby Food 300g": { category: "Baby Care", classification: "Household Need", base: 245 },
  "Frozen Veg Pizza 325g": { category: "Instant & Frozen Food", classification: "Unclear", base: 199 },
  "McCain French Fries 425g": { category: "Instant & Frozen Food", classification: "Unclear", base: 165 },
};

function categoryId(name: string): string {
  const found = CATEGORIES.find((c) => c.name === name);
  return found ? found.id : "cat_unknown";
}

// ---------------------------------------------------------------------------
// Order seed data
// ---------------------------------------------------------------------------

interface RawItem {
  name: string;
  qty: number;
  price?: number; // overrides catalog base price (used to model price creep)
}

interface RawOrder {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm, 24h
  platform: PlatformSlug;
  items: RawItem[];
}

// 2026-07-09 is "today" for this seed set; dates below span the ~6 weeks prior.
const RAW_ORDERS: RawOrder[] = [
  { date: "2026-05-26", time: "18:30", platform: "blinkit", items: [{ name: "Amul Taaza Milk 500ml", qty: 2 }, { name: "Britannia Brown Bread 400g", qty: 1 }, { name: "Aashirvaad Atta 5kg", qty: 1, price: 275 }] },
  { date: "2026-05-27", time: "23:40", platform: "zepto", items: [{ name: "Cadbury Dairy Milk Silk", qty: 2 }, { name: "Amul Ice Cream Tub 700ml", qty: 1 }, { name: "Coca-Cola 750ml", qty: 1 }] },
  { date: "2026-05-29", time: "10:15", platform: "bigbasket", items: [{ name: "Onions 1kg", qty: 2 }, { name: "Tomatoes 1kg", qty: 2 }, { name: "Toor Dal 1kg", qty: 1 }, { name: "Fortune Sunflower Oil 1L", qty: 1 }] },
  { date: "2026-05-30", time: "20:05", platform: "zepto", items: [{ name: "Amul Butter 500g", qty: 1, price: 265 }, { name: "Britannia Brown Bread 400g", qty: 1 }] },
  { date: "2026-06-01", time: "13:20", platform: "instamart", items: [{ name: "Maggi Noodles 4-pack", qty: 2 }, { name: "Lay's Classic Salted 52g", qty: 3 }, { name: "Bingo Mad Angles 72g", qty: 2 }] },
  { date: "2026-06-02", time: "19:45", platform: "blinkit", items: [{ name: "Amul Taaza Milk 500ml", qty: 2 }, { name: "Tata Salt 1kg", qty: 1 }, { name: "Bananas Dozen", qty: 1 }] },
  { date: "2026-06-03", time: "00:20", platform: "zepto", items: [{ name: "Red Bull 250ml", qty: 2 }, { name: "Kurkure Masala Munch 90g", qty: 2 }] },
  { date: "2026-06-05", time: "17:10", platform: "bigbasket", items: [{ name: "India Gate Basmati Rice 5kg", qty: 1 }, { name: "Potatoes 1kg", qty: 2 }, { name: "Onions 1kg", qty: 2 }] },
  { date: "2026-06-06", time: "21:50", platform: "instamart", items: [{ name: "Frozen Veg Pizza 325g", qty: 1 }, { name: "McCain French Fries 425g", qty: 1 }, { name: "Coca-Cola 750ml", qty: 1 }] },
  { date: "2026-06-07", time: "09:30", platform: "blinkit", items: [{ name: "Amul Taaza Milk 500ml", qty: 2 }, { name: "Britannia Brown Bread 400g", qty: 1 }, { name: "Aashirvaad Atta 5kg", qty: 1, price: 289 }] },
  { date: "2026-06-09", time: "22:55", platform: "zepto", items: [{ name: "Amul Butter 500g", qty: 1, price: 279 }, { name: "Haldiram's Bhujia 200g", qty: 1 }] },
  { date: "2026-06-10", time: "16:00", platform: "blinkit", items: [{ name: "Colgate Toothpaste 200g", qty: 1 }, { name: "Dove Soap 3-pack", qty: 1 }, { name: "Harpic Toilet Cleaner 1L", qty: 1 }] },
  { date: "2026-06-11", time: "12:40", platform: "instamart", items: [{ name: "Kwality Walls Cornetto", qty: 3 }, { name: "Sprite 750ml", qty: 1 }] },
  { date: "2026-06-12", time: "18:15", platform: "bigbasket", items: [{ name: "Tomatoes 1kg", qty: 2 }, { name: "Toor Dal 1kg", qty: 1 }, { name: "Surf Excel 1kg", qty: 1 }] },
  { date: "2026-06-14", time: "23:10", platform: "zepto", items: [{ name: "Cadbury Dairy Milk Silk", qty: 1 }, { name: "Kurkure Masala Munch 90g", qty: 2 }, { name: "Red Bull 250ml", qty: 1 }] },
  { date: "2026-06-15", time: "08:50", platform: "blinkit", items: [{ name: "Amul Taaza Milk 500ml", qty: 2 }, { name: "Bananas Dozen", qty: 1 }] },
  { date: "2026-06-17", time: "20:30", platform: "blinkit", items: [{ name: "Britannia Brown Bread 400g", qty: 1 }, { name: "Aashirvaad Atta 5kg", qty: 1, price: 305 }, { name: "Tata Salt 1kg", qty: 1 }] },
  { date: "2026-06-18", time: "14:05", platform: "instamart", items: [{ name: "Maggi Noodles 4-pack", qty: 1 }, { name: "Bingo Mad Angles 72g", qty: 2 }, { name: "Frozen Veg Pizza 325g", qty: 1 }] },
  { date: "2026-06-19", time: "23:35", platform: "zepto", items: [{ name: "Amul Ice Cream Tub 700ml", qty: 1 }, { name: "Coca-Cola 750ml", qty: 2 }] },
  { date: "2026-06-21", time: "11:20", platform: "bigbasket", items: [{ name: "Onions 1kg", qty: 2 }, { name: "Potatoes 1kg", qty: 2 }, { name: "Fortune Sunflower Oil 1L", qty: 1 }, { name: "Real Fruit Juice 1L", qty: 1 }] },
  { date: "2026-06-22", time: "19:00", platform: "blinkit", items: [{ name: "Amul Taaza Milk 500ml", qty: 2 }, { name: "Colgate Toothpaste 200g", qty: 1 }] },
  { date: "2026-06-24", time: "22:15", platform: "zepto", items: [{ name: "Amul Butter 500g", qty: 1, price: 299 }, { name: "Haldiram's Bhujia 200g", qty: 1 }, { name: "Lay's Classic Salted 52g", qty: 2 }] },
  { date: "2026-06-25", time: "13:45", platform: "instamart", items: [{ name: "Kwality Walls Cornetto", qty: 2 }, { name: "Sprite 750ml", qty: 1 }, { name: "Kurkure Masala Munch 90g", qty: 1 }] },
  { date: "2026-06-27", time: "17:30", platform: "bigbasket", items: [{ name: "India Gate Basmati Rice 5kg", qty: 1 }, { name: "Toor Dal 1kg", qty: 1 }, { name: "Nescafe Classic Coffee 100g", qty: 1 }] },
  { date: "2026-06-28", time: "09:10", platform: "blinkit", items: [{ name: "Amul Taaza Milk 500ml", qty: 2 }, { name: "Britannia Brown Bread 400g", qty: 1 }] },
  { date: "2026-06-29", time: "23:50", platform: "zepto", items: [{ name: "Red Bull 250ml", qty: 2 }, { name: "Cadbury Dairy Milk Silk", qty: 1 }] },
  { date: "2026-07-01", time: "18:40", platform: "blinkit", items: [{ name: "Amul Taaza Milk 500ml", qty: 2 }, { name: "Tata Salt 1kg", qty: 1 }, { name: "Bananas Dozen", qty: 1 }] },
  { date: "2026-07-02", time: "20:20", platform: "instamart", items: [{ name: "Frozen Veg Pizza 325g", qty: 1 }, { name: "McCain French Fries 425g", qty: 1 }, { name: "Coca-Cola 750ml", qty: 1 }, { name: "Bingo Mad Angles 72g", qty: 1 }] },
  { date: "2026-07-03", time: "12:00", platform: "bigbasket", items: [{ name: "Onions 1kg", qty: 2 }, { name: "Tomatoes 1kg", qty: 2 }, { name: "Surf Excel 1kg", qty: 1 }, { name: "Vim Dishwash Bar 3-pack", qty: 1 }] },
  { date: "2026-07-05", time: "21:05", platform: "blinkit", items: [{ name: "Amul Taaza Milk 500ml", qty: 2 }, { name: "Britannia Brown Bread 400g", qty: 1 }, { name: "Aashirvaad Atta 5kg", qty: 1, price: 305 }] },
  { date: "2026-07-06", time: "23:25", platform: "zepto", items: [{ name: "Amul Butter 500g", qty: 1, price: 299 }, { name: "Amul Ice Cream Tub 700ml", qty: 1 }, { name: "Haldiram's Bhujia 200g", qty: 1 }] },
  { date: "2026-07-07", time: "15:30", platform: "instamart", items: [{ name: "Kwality Walls Cornetto", qty: 2 }, { name: "Lay's Classic Salted 52g", qty: 2 }, { name: "Sprite 750ml", qty: 1 }] },
  { date: "2026-07-08", time: "19:15", platform: "bigbasket", items: [{ name: "Head & Shoulders Shampoo 340ml", qty: 1 }, { name: "Pampers Diapers Pack M", qty: 1 }, { name: "Cerelac Baby Food 300g", qty: 1 }] },
  { date: "2026-07-08", time: "22:40", platform: "zepto", items: [{ name: "Kurkure Masala Munch 90g", qty: 2 }, { name: "Coca-Cola 750ml", qty: 1 }, { name: "Cadbury Dairy Milk Silk", qty: 1 }] },
];

function isLateNight(time: string): boolean {
  const hour = Number(time.split(":")[0]);
  return hour >= 23 || hour < 5;
}

function buildOrders(): Order[] {
  return RAW_ORDERS.map((raw, orderIdx) => {
    const platform = PLATFORMS[raw.platform];
    const orderId = `order_${String(orderIdx + 1).padStart(3, "0")}`;
    const items: OrderItem[] = raw.items.map((raw_item, itemIdx) => {
      const catalog = ITEM_CATALOG[raw_item.name];
      const unitPrice = raw_item.price ?? catalog.base;
      return {
        id: `${orderId}_item_${itemIdx + 1}`,
        order_id: orderId,
        name: raw_item.name,
        category_id: categoryId(catalog.category),
        category_name: catalog.category,
        classification: catalog.classification,
        unit_price: unitPrice,
        quantity: raw_item.qty,
      };
    });
    const total_amount = items.reduce((sum, it) => sum + it.unit_price * it.quantity, 0);
    return {
      id: orderId,
      platform_id: platform.id,
      platform,
      ordered_at: `${raw.date}T${raw.time}:00`,
      total_amount,
      item_count: items.reduce((n, it) => n + it.quantity, 0),
      is_late_night: isLateNight(raw.time),
      items,
    };
  });
}

export const ORDERS: Order[] = buildOrders();

export const TODAY = "2026-07-09";

// ---------------------------------------------------------------------------
// Derived analytics (would be SQL aggregations against Supabase in production)
// ---------------------------------------------------------------------------

export function computeDashboardStats(orders: Order[] = ORDERS) {
  const totalSpend = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const impulseSpend = orders.reduce(
    (sum, o) =>
      sum +
      o.items
        .filter((it) => it.classification === "Impulse Buy" || it.classification === "Junk/Snack")
        .reduce((s, it) => s + it.unit_price * it.quantity, 0),
    0,
  );
  const lateNightOrderCount = orders.filter((o) => o.is_late_night).length;
  const impulseTaxPercent = totalSpend > 0 ? (impulseSpend / totalSpend) * 100 : 0;

  const sorted = [...orders].sort((a, b) => a.ordered_at.localeCompare(b.ordered_at));
  const midpoint = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, midpoint).reduce((s, o) => s + o.total_amount, 0);
  const secondHalf = sorted.slice(midpoint).reduce((s, o) => s + o.total_amount, 0);
  const spendChangePercent = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;

  return {
    totalSpend,
    impulseSpend,
    impulseTaxPercent,
    lateNightOrderCount,
    totalOrderCount: orders.length,
    spendChangePercent,
  };
}

export function computeSpendTrend(orders: Order[] = ORDERS) {
  const byDate = new Map<string, number>();
  for (const order of orders) {
    const date = order.ordered_at.slice(0, 10);
    byDate.set(date, (byDate.get(date) ?? 0) + order.total_amount);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, amount]) => ({ date, amount: Math.round(amount) }));
}

export function computePlatformBreakdown(orders: Order[] = ORDERS) {
  const byPlatform = new Map<string, { platform: Platform; amount: number; orders: number }>();
  for (const order of orders) {
    const entry = byPlatform.get(order.platform.slug) ?? { platform: order.platform, amount: 0, orders: 0 };
    entry.amount += order.total_amount;
    entry.orders += 1;
    byPlatform.set(order.platform.slug, entry);
  }
  return [...byPlatform.values()].sort((a, b) => b.amount - a.amount);
}

export function computeTopImpulseCategories(orders: Order[] = ORDERS, limit = 5) {
  const byCategory = new Map<string, number>();
  for (const order of orders) {
    for (const item of order.items) {
      if (item.classification === "Impulse Buy" || item.classification === "Junk/Snack") {
        byCategory.set(item.category_name, (byCategory.get(item.category_name) ?? 0) + item.unit_price * item.quantity);
      }
    }
  }
  return [...byCategory.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([category, amount]) => ({ category, amount: Math.round(amount) }));
}

export function computeTopImpulseItems(orders: Order[] = ORDERS, limit = 8) {
  const byItem = new Map<string, { name: string; category: string; amount: number; count: number }>();
  for (const order of orders) {
    for (const item of order.items) {
      if (item.classification !== "Impulse Buy" && item.classification !== "Junk/Snack") continue;
      const entry = byItem.get(item.name) ?? { name: item.name, category: item.category_name, amount: 0, count: 0 };
      entry.amount += item.unit_price * item.quantity;
      entry.count += item.quantity;
      byItem.set(item.name, entry);
    }
  }
  return [...byItem.values()].sort((a, b) => b.amount - a.amount).slice(0, limit);
}

export function computeImpulseTaxByPlatform(orders: Order[] = ORDERS) {
  const byPlatform = new Map<string, { platform: Platform; totalSpend: number; impulseSpend: number }>();
  for (const order of orders) {
    const entry = byPlatform.get(order.platform.slug) ?? { platform: order.platform, totalSpend: 0, impulseSpend: 0 };
    entry.totalSpend += order.total_amount;
    entry.impulseSpend += order.items
      .filter((it) => it.classification === "Impulse Buy" || it.classification === "Junk/Snack")
      .reduce((s, it) => s + it.unit_price * it.quantity, 0);
    byPlatform.set(order.platform.slug, entry);
  }
  return [...byPlatform.values()]
    .map((entry) => ({
      ...entry,
      impulseTaxPercent: entry.totalSpend > 0 ? (entry.impulseSpend / entry.totalSpend) * 100 : 0,
    }))
    .sort((a, b) => b.impulseTaxPercent - a.impulseTaxPercent);
}

export function computePriceCreepAlerts(orders: Order[] = ORDERS, minIncreasePercent = 4): PriceCreepAlert[] {
  const key = (platformSlug: string, name: string) => `${platformSlug}::${name}`;
  const groups = new Map<string, { platform: Platform; name: string; points: { price: number; date: string }[] }>();

  for (const order of orders) {
    for (const item of order.items) {
      const k = key(order.platform.slug, item.name);
      const entry = groups.get(k) ?? { platform: order.platform, name: item.name, points: [] };
      entry.points.push({ price: item.unit_price, date: order.ordered_at });
      groups.set(k, entry);
    }
  }

  const alerts: PriceCreepAlert[] = [];
  for (const group of groups.values()) {
    if (group.points.length < 2) continue;
    const sorted = [...group.points].sort((a, b) => a.date.localeCompare(b.date));
    const first = sorted[0];
    const latest = sorted[sorted.length - 1];
    if (latest.price <= first.price) continue;
    const percentIncrease = ((latest.price - first.price) / first.price) * 100;
    if (percentIncrease < minIncreasePercent) continue;
    alerts.push({
      item_name: group.name,
      platform: group.platform,
      first_price: first.price,
      latest_price: latest.price,
      percent_increase: percentIncrease,
      first_seen_at: first.date,
      latest_seen_at: latest.date,
      occurrences: sorted.length,
      history: sorted.map((p) => ({ date: p.date, price: p.price })),
    });
  }
  return alerts.sort((a, b) => b.percent_increase - a.percent_increase);
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return ms / (1000 * 60 * 60 * 24);
}

export function computeRecurringItems(orders: Order[] = ORDERS, minOccurrences = 3): RecurringItem[] {
  const key = (platformSlug: string, name: string) => `${platformSlug}::${name}`;
  const groups = new Map<
    string,
    { platform: Platform; name: string; category: string; dates: string[]; prices: number[] }
  >();

  for (const order of orders) {
    for (const item of order.items) {
      const k = key(order.platform.slug, item.name);
      const entry = groups.get(k) ?? { platform: order.platform, name: item.name, category: item.category_name, dates: [], prices: [] };
      entry.dates.push(order.ordered_at);
      entry.prices.push(item.unit_price);
      groups.set(k, entry);
    }
  }

  const results: RecurringItem[] = [];
  for (const [k, group] of groups.entries()) {
    if (group.dates.length < minOccurrences) continue;
    const sortedDates = [...group.dates].sort();
    const gaps: number[] = [];
    for (let i = 1; i < sortedDates.length; i++) {
      gaps.push(daysBetween(sortedDates[i - 1], sortedDates[i]));
    }
    const avgGap = gaps.reduce((s, g) => s + g, 0) / gaps.length;
    const lastOrderedAt = sortedDates[sortedDates.length - 1];
    const avgPrice = group.prices.reduce((s, p) => s + p, 0) / group.prices.length;
    const nextExpected = new Date(new Date(lastOrderedAt).getTime() + avgGap * 24 * 60 * 60 * 1000);

    results.push({
      id: `recurring_${k.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`,
      item_name: group.name,
      category_name: group.category,
      platform_id: group.platform.id,
      platform: group.platform,
      frequency_days: Math.round(avgGap),
      avg_price: Math.round(avgPrice),
      last_ordered_at: lastOrderedAt,
      next_expected_at: nextExpected.toISOString().slice(0, 10),
      times_ordered: group.dates.length,
    });
  }
  return results.sort((a, b) => a.frequency_days - b.frequency_days);
}

export function computeTimePatterns(orders: Order[] = ORDERS) {
  const hourBuckets = Array.from({ length: 24 }, (_, hour) => ({ hour, amount: 0, orders: 0 }));
  const dayOfWeekBuckets = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => ({
    day: label,
    amount: 0,
    orders: 0,
  }));

  for (const order of orders) {
    const dt = new Date(order.ordered_at);
    const hour = dt.getHours();
    const dow = dt.getDay();
    hourBuckets[hour].amount += order.total_amount;
    hourBuckets[hour].orders += 1;
    dayOfWeekBuckets[dow].amount += order.total_amount;
    dayOfWeekBuckets[dow].orders += 1;
  }

  return {
    byHour: hourBuckets.map((b) => ({ ...b, amount: Math.round(b.amount) })),
    byDayOfWeek: dayOfWeekBuckets.map((b) => ({ ...b, amount: Math.round(b.amount) })),
  };
}

// ---------------------------------------------------------------------------
// Import (mock OCR) seed data
// ---------------------------------------------------------------------------

export const MOCK_IMPORT_JOBS: ImportJob[] = [
  {
    id: "job_001",
    platform_id: PLATFORMS.blinkit.id,
    file_name: "blinkit_invoice_jul06.pdf",
    file_url: null,
    status: "completed",
    created_at: "2026-07-06T21:12:00",
    extracted_items: [
      { id: "job_001_1", name: "Amul Taaza Milk 500ml", category_name: "Dairy & Bakery", classification: "Recurring Staple", unit_price: 33, quantity: 2, confidence: 0.97 },
      { id: "job_001_2", name: "Britannia Brown Bread 400g", category_name: "Dairy & Bakery", classification: "Recurring Staple", unit_price: 45, quantity: 1, confidence: 0.94 },
    ],
  },
  {
    id: "job_002",
    platform_id: PLATFORMS.zepto.id,
    file_name: "zepto_screenshot_jul08.png",
    file_url: null,
    status: "completed",
    created_at: "2026-07-08T22:41:00",
    extracted_items: [
      { id: "job_002_1", name: "Kurkure Masala Munch 90g", category_name: "Snacks & Namkeen", classification: "Impulse Buy", unit_price: 20, quantity: 2, confidence: 0.91 },
      { id: "job_002_2", name: "Coca-Cola 750ml", category_name: "Beverages", classification: "Impulse Buy", unit_price: 45, quantity: 1, confidence: 0.95 },
      { id: "job_002_3", name: "Cadbury Dairy Milk Silk", category_name: "Ice Cream & Desserts", classification: "Impulse Buy", unit_price: 199, quantity: 1, confidence: 0.89 },
    ],
  },
];

/**
 * TODO(real-ocr): Replace with a real OCR + parsing pipeline (e.g. Google
 * Vision / Textract for screenshots, pdf-parse + LLM extraction for PDF
 * invoices). This mock simply returns a plausible line-item breakdown so the
 * import UI and downstream analytics can be built end-to-end today.
 */
export function mockParseReceipt(platform: PlatformSlug, fileName: string) {
  const pool = Object.entries(ITEM_CATALOG);
  const seedIndex = fileName.length % pool.length;
  const pickCount = 2 + (fileName.length % 3);
  const picked: typeof pool = [];
  for (let i = 0; i < pickCount; i++) {
    picked.push(pool[(seedIndex + i * 3) % pool.length]);
  }
  return picked.map(([name, entry], idx) => ({
    id: `extract_${idx + 1}`,
    name,
    category_name: entry.category,
    classification: entry.classification,
    unit_price: entry.base,
    quantity: 1 + (idx % 2),
    confidence: 0.82 + (idx % 4) * 0.03,
  }));
}
