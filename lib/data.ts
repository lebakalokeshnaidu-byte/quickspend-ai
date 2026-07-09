import { isSupabaseConfigured, createServiceRoleClient } from "./supabase/server";
import {
  MOCK_IMPORT_JOBS,
  ORDERS as MOCK_ORDERS,
  PLATFORM_LIST,
  computeRecurringItems,
} from "./mock-data";
import type { ImportJob, Order, OrderItem, Platform, RecurringItem } from "./types";

/**
 * Single data-access layer used by pages and API routes.
 *
 * When Supabase env vars are configured, reads/writes go to Postgres.
 * Otherwise everything transparently falls back to the in-memory seed data
 * in lib/mock-data.ts so the full frontend is explorable with zero setup.
 */

interface DbOrderRow {
  id: string;
  ordered_at: string;
  total_amount: number;
  item_count: number;
  is_late_night: boolean;
  platform: Platform | { id: string; slug: string; name: string; color: string };
  items: (Omit<OrderItem, "category_name"> & { category_name?: string; categories?: { name: string } })[];
}

function mapDbOrder(row: DbOrderRow): Order {
  const platform = row.platform as Platform;
  return {
    id: row.id,
    platform_id: platform.id,
    platform,
    ordered_at: row.ordered_at,
    total_amount: Number(row.total_amount),
    item_count: row.item_count,
    is_late_night: row.is_late_night,
    items: (row.items ?? []).map((item) => ({
      ...item,
      category_name: item.category_name ?? item.categories?.name ?? "Uncategorized",
    })) as OrderItem[],
  };
}

export async function getPlatforms(): Promise<Platform[]> {
  if (!isSupabaseConfigured()) return PLATFORM_LIST;
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.from("platforms").select("*").order("name");
    if (error || !data || data.length === 0) return PLATFORM_LIST;
    return data as Platform[];
  } catch {
    return PLATFORM_LIST;
  }
}

export async function getOrders(): Promise<Order[]> {
  if (!isSupabaseConfigured()) return MOCK_ORDERS;
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, ordered_at, total_amount, item_count, is_late_night, platform:platforms(id, slug, name, color), items:order_items(id, order_id, name, category_id, classification, unit_price, quantity, categories(name))",
      )
      .order("ordered_at", { ascending: false });
    if (error || !data || data.length === 0) return MOCK_ORDERS;
    return (data as unknown as DbOrderRow[]).map(mapDbOrder);
  } catch {
    return MOCK_ORDERS;
  }
}

export async function getRecurringItems(): Promise<RecurringItem[]> {
  if (!isSupabaseConfigured()) return computeRecurringItems();
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("recurring_items")
      .select("*, platform:platforms(id, slug, name, color)")
      .order("frequency_days");
    if (error || !data || data.length === 0) {
      const orders = await getOrders();
      return computeRecurringItems(orders);
    }
    return data as RecurringItem[];
  } catch {
    const orders = await getOrders();
    return computeRecurringItems(orders);
  }
}

export async function getImportJobs(): Promise<ImportJob[]> {
  if (!isSupabaseConfigured()) return MOCK_IMPORT_JOBS;
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("import_jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return MOCK_IMPORT_JOBS;
    return data as ImportJob[];
  } catch {
    return MOCK_IMPORT_JOBS;
  }
}

export async function saveImportJob(job: {
  platform_id: string | null;
  file_name: string;
  file_url: string | null;
  items: ImportJob["extracted_items"];
}): Promise<{ id: string; persisted: boolean }> {
  if (!isSupabaseConfigured()) {
    // TODO(persistence): without Supabase configured there is nowhere durable
    // to write this — the import UI still works end-to-end against mock data.
    return { id: `mock_job_${Date.now()}`, persisted: false };
  }
  try {
    const supabase = createServiceRoleClient();
    const { data: importJob, error } = await supabase
      .from("import_jobs")
      .insert({
        platform_id: job.platform_id,
        file_name: job.file_name,
        file_url: job.file_url,
        status: "completed",
      })
      .select()
      .single();
    if (error) throw error;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        platform_id: job.platform_id,
        ordered_at: new Date().toISOString(),
        total_amount: job.items.reduce((s, it) => s + it.unit_price * it.quantity, 0),
        item_count: job.items.reduce((s, it) => s + it.quantity, 0),
        is_late_night: [23, 0, 1, 2, 3, 4].includes(new Date().getHours()),
        import_job_id: importJob.id,
      })
      .select()
      .single();
    if (orderError) throw orderError;

    const { error: itemsError } = await supabase.from("order_items").insert(
      job.items.map((item) => ({
        order_id: order.id,
        name: item.name,
        category_id: null,
        classification: item.classification,
        unit_price: item.unit_price,
        quantity: item.quantity,
      })),
    );
    if (itemsError) throw itemsError;

    return { id: importJob.id, persisted: true };
  } catch {
    return { id: `mock_job_${Date.now()}`, persisted: false };
  }
}
