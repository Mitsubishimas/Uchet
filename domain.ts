import { APP_TIMEZONE } from "./config.js";

export const STATUSES = ["created", "paid", "shipped"] as const;
export type OrderStatus = (typeof STATUSES)[number];

export const DELIVERIES = ["post", "site", "cdek"] as const;
export type Delivery = (typeof DELIVERIES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  created: "Создан",
  paid: "Оплачен",
  shipped: "Отгружен",
};

export const DELIVERY_LABELS: Record<Delivery, string> = {
  post: "Почта",
  site: "Сайт MasterMitsu.ru",
  cdek: "СДЭК",
};

export interface Order {
  readonly id: number;
  readonly created_at: string;
  readonly customer_name: string;
  readonly phone: string;
  readonly email: string;
  readonly car: string;
  readonly vin: string;
  readonly engine: string;
  readonly gearbox: string;
  readonly power_hp: number | null;
  readonly torque_nm: number | null;
  readonly consumption: number | null;
  readonly vmax: number | null;
  readonly spec_notes: string;
  readonly item_firmware: boolean;
  readonly item_ecu: boolean;
  readonly amount_cents: number;
  readonly status: OrderStatus;
  readonly delivery: Delivery;
}

/** Черновик заказа, пришедший из формы: значения уже разобраны и проверены. */
export type OrderDraft = Omit<Order, "id">;

export function isStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (STATUSES as readonly string[]).includes(value);
}

export function isDelivery(value: unknown): value is Delivery {
  return typeof value === "string" && (DELIVERIES as readonly string[]).includes(value);
}

// ── Даты и суммы ─────────────────────────────────────────────────────────────

const isoFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: APP_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Сегодняшняя календарная дата в часовом поясе приложения: YYYY-MM-DD. */
export function todayISO(now: Date = new Date()): string {
  return isoFormatter.format(now);
}

function parseISO(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface Period {
  readonly from: string;
  readonly to: string;
  readonly label: string;
}

const dayMonth = new Intl.DateTimeFormat("ru-RU", { timeZone: "UTC", day: "numeric", month: "long" });
const dayMonthYear = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "UTC",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const monthYear = new Intl.DateTimeFormat("ru-RU", { timeZone: "UTC", month: "long", year: "numeric" });

/** Текущая неделя, понедельник–воскресенье. */
export function weekPeriod(today: string): Period {
  const base = parseISO(today);
  const shift = (base.getUTCDay() + 6) % 7;
  const from = new Date(base.getTime() - shift * 86_400_000);
  const to = new Date(from.getTime() + 6 * 86_400_000);
  const label =
    from.getUTCMonth() === to.getUTCMonth()
      ? `${from.getUTCDate()}–${dayMonth.format(to)}`
      : `${dayMonth.format(from)} – ${dayMonth.format(to)}`;
  return { from: toISO(from), to: toISO(to), label };
}

/** Текущий календарный месяц. */
export function monthPeriod(today: string): Period {
  const base = parseISO(today);
  const from = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), 1));
  const to = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0));
  return { from: toISO(from), to: toISO(to), label: monthYear.format(from) };
}

export function inPeriod(order: Order, period: Period): boolean {
  return order.created_at >= period.from && order.created_at <= period.to;
}

export function formatDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  return dayMonthYear.format(parseISO(iso));
}

const numberFormat = new Intl.NumberFormat("ru-RU", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatMoney(cents: number): string {
  return `${numberFormat.format(cents / 100)} ₽`;
}

export function formatNumber(value: number | null, suffix = ""): string {
  if (value === null) return "—";
  return `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(value)}${suffix}`;
}

/** «45 000,50», «45000.5», «45 000» → копейки; мусор → null. */
export function parseMoney(raw: string): number | null {
  const cleaned = raw.replace(/\s|\u00a0/g, "").replace(",", ".");
  if (!cleaned) return 0;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  return Math.round(Number(cleaned) * 100);
}

export function parseNumberField(raw: string): number | null | "invalid" {
  const cleaned = raw.replace(/\s|\u00a0/g, "").replace(",", ".");
  if (!cleaned) return null;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return "invalid";
  return Number(cleaned);
}

export function moneyInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

// ── Аналитика ────────────────────────────────────────────────────────────────

export interface BreakdownRow {
  readonly label: string;
  readonly count: number;
  readonly sum_cents: number;
}

export interface AnalyticsPeriod {
  readonly key: "week" | "month";
  readonly title: string;
  readonly period: Period;
  readonly count: number;
  readonly sum_cents: number;
  readonly earned_cents: number;
  readonly average_cents: number;
  readonly byStatus: BreakdownRow[];
  readonly byDelivery: BreakdownRow[];
}

export function analyticsFor(
  orders: readonly Order[],
  period: Period,
  key: "week" | "month",
  title: string,
): AnalyticsPeriod {
  const rows = orders.filter((order) => inPeriod(order, period));
  const sum = rows.reduce((total, order) => total + order.amount_cents, 0);
  const earned = rows
    .filter((order) => order.status !== "created")
    .reduce((total, order) => total + order.amount_cents, 0);
  const byStatus = STATUSES.map((status) => ({
    label: STATUS_LABELS[status],
    count: rows.filter((order) => order.status === status).length,
    sum_cents: rows
      .filter((order) => order.status === status)
      .reduce((total, order) => total + order.amount_cents, 0),
  }));
  const byDelivery = DELIVERIES.map((delivery) => ({
    label: DELIVERY_LABELS[delivery],
    count: rows.filter((order) => order.delivery === delivery).length,
    sum_cents: rows
      .filter((order) => order.delivery === delivery)
      .reduce((total, order) => total + order.amount_cents, 0),
  }));
  return {
    key,
    title,
    period,
    count: rows.length,
    sum_cents: sum,
    earned_cents: earned,
    average_cents: rows.length ? Math.round(sum / rows.length) : 0,
    byStatus,
    byDelivery,
  };
}

export function itemsLabel(order: Order): string {
  const items = [order.item_firmware ? "Прошивка" : "", order.item_ecu ? "Блок управления" : ""];
  return items.filter(Boolean).join(" + ") || "—";
}