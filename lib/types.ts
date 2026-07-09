export type PlatformSlug = "blinkit" | "zepto" | "instamart" | "bigbasket";

export interface Platform {
  id: string;
  slug: PlatformSlug;
  name: string;
  color: string;
}

export type ClassificationLabel =
  | "Planned Grocery"
  | "Impulse Buy"
  | "Junk/Snack"
  | "Recurring Staple"
  | "Household Need"
  | "Unclear";

export const CLASSIFICATION_LABELS: ClassificationLabel[] = [
  "Planned Grocery",
  "Impulse Buy",
  "Junk/Snack",
  "Recurring Staple",
  "Household Need",
  "Unclear",
];

export const IMPULSE_LABELS: ClassificationLabel[] = ["Impulse Buy", "Junk/Snack"];

export interface Category {
  id: string;
  name: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  name: string;
  category_id: string;
  category_name: string;
  classification: ClassificationLabel;
  unit_price: number;
  quantity: number;
}

export interface Order {
  id: string;
  platform_id: string;
  platform: Platform;
  ordered_at: string; // ISO timestamp
  total_amount: number;
  item_count: number;
  is_late_night: boolean;
  items: OrderItem[];
}

export interface RecurringItem {
  id: string;
  item_name: string;
  category_name: string;
  platform_id: string;
  platform: Platform;
  frequency_days: number;
  avg_price: number;
  last_ordered_at: string;
  next_expected_at: string;
  times_ordered: number;
}

export type ImportJobStatus = "pending" | "processing" | "completed" | "failed";

export interface ImportJob {
  id: string;
  platform_id: string | null;
  file_name: string;
  file_url: string | null;
  status: ImportJobStatus;
  created_at: string;
  extracted_items: ExtractedItem[];
}

export interface ExtractedItem {
  id: string;
  name: string;
  category_name: string;
  classification: ClassificationLabel;
  unit_price: number;
  quantity: number;
  confidence: number;
}

export interface PriceCreepAlert {
  item_name: string;
  platform: Platform;
  first_price: number;
  latest_price: number;
  percent_increase: number;
  first_seen_at: string;
  latest_seen_at: string;
  occurrences: number;
  history: { date: string; price: number }[];
}

export interface DashboardStats {
  totalSpend: number;
  impulseSpend: number;
  impulseTaxPercent: number;
  lateNightOrderCount: number;
  totalOrderCount: number;
  spendChangePercent: number;
}
