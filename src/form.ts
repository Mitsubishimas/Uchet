import {
  isDelivery,
  isStatus,
  moneyInput,
  parseMoney,
  parseNumberField,
  todayISO,
  type Delivery,
  type Order,
  type OrderDraft,
  type OrderStatus,
} from "./domain.js";

export type FormValues = Record<string, string>;

export interface ParseResult {
  readonly draft: OrderDraft | null;
  readonly errors: string[];
  readonly values: FormValues;
}

const text = (raw: unknown, limit: number): string =>
  (typeof raw === "string" ? raw : "").trim().slice(0, limit);

const checkbox = (raw: unknown): boolean =>
  raw === "on" || raw === "1" || raw === "true" || raw === "yes";

export const FIELDS: readonly string[] = [
  "created_at",
  "customer_name",
  "phone",
  "email",
  "car",
  "vin",
  "engine",
  "gearbox",
  "power_hp",
  "torque_nm",
  "consumption",
  "vmax",
  "spec_notes",
  "amount",
  "status",
  "delivery",
  "item_firmware",
  "item_ecu",
];

/** Значения формы из тела запроса: строки для повторного показа полей. */
export function readValues(body: Record<string, unknown>): FormValues {
  const values: FormValues = {};
  for (const field of FIELDS) values[field] = typeof body[field] === "string" ? (body[field] as string) : "";
  if (!values.created_at) values.created_at = todayISO();
  if (!values.status) values.status = "created";
  if (!values.delivery) values.delivery = "cdek";
  return values;
}

/** Разбирает и проверяет форму заказа. Пустой customer_name — ошибка. */
export function parseOrderForm(body: Record<string, unknown>): ParseResult {
  const values = readValues(body);
  const errors: string[] = [];

  const customerName = text(body.customer_name, 120);
  if (!customerName) errors.push("Укажите имя покупателя.");

  const createdAt = text(body.created_at, 10) || todayISO();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(createdAt) || Number.isNaN(Date.parse(createdAt)))
    errors.push("Дата заказа должна быть в формате ГГГГ-ММ-ДД.");

  const amount = parseMoney(text(body.amount, 40));
  if (amount === null) errors.push("Сумма должна быть числом, например 45 000,50.");

  const numbers: Record<string, number | null> = {};
  for (const [field, label] of [
    ["power_hp", "Мощность"],
    ["torque_nm", "Момент"],
    ["consumption", "Расход"],
    ["vmax", "Максимальная скорость"],
  ] as const) {
    const parsed = parseNumberField(text(body[field], 20));
    if (parsed === "invalid") {
      errors.push(`${label}: введите число.`);
      numbers[field] = null;
    } else numbers[field] = parsed;
  }

  const itemFirmware = checkbox(body.item_firmware);
  const itemEcu = checkbox(body.item_ecu);
  if (!itemFirmware && !itemEcu) errors.push("Отметьте хотя бы одну позицию: «Прошивка» или «Блок управления».");

  const status: OrderStatus = isStatus(body.status) ? body.status : "created";
  const delivery: Delivery = isDelivery(body.delivery) ? body.delivery : "cdek";

  if (errors.length || amount === null) return { draft: null, errors, values };

  return {
    errors: [],
    values,
    draft: {
      created_at: createdAt,
      customer_name: customerName,
      phone: text(body.phone, 40),
      email: text(body.email, 120),
      car: text(body.car, 120),
      vin: text(body.vin, 40),
      engine: text(body.engine, 80),
      gearbox: text(body.gearbox, 80),
      power_hp: numbers.power_hp,
      torque_nm: numbers.torque_nm,
      consumption: numbers.consumption,
      vmax: numbers.vmax,
      spec_notes: text(body.spec_notes, 2000),
      item_firmware: itemFirmware,
      item_ecu: itemEcu,
      amount_cents: amount,
      status,
      delivery,
    },
  };
}
/** Значения формы из сохранённого заказа — для карточки редактирования. */
export function valuesFromOrder(order: Order): FormValues {
  const raw: Record<string, string> = {
    created_at: order.created_at,
    customer_name: order.customer_name,
    phone: order.phone,
    email: order.email,
    car: order.car,
    vin: order.vin,
    engine: order.engine,
    gearbox: order.gearbox,
    power_hp: order.power_hp === null ? "" : String(order.power_hp),
    torque_nm: order.torque_nm === null ? "" : String(order.torque_nm),
    consumption: order.consumption === null ? "" : String(order.consumption).replace(".", ","),
    vmax: order.vmax === null ? "" : String(order.vmax),
    spec_notes: order.spec_notes,
    amount: moneyInput(order.amount_cents),
    status: order.status,
    delivery: order.delivery,
    item_firmware: order.item_firmware ? "on" : "",
    item_ecu: order.item_ecu ? "on" : "",
  };
  const values: FormValues = {};
  for (const field of FIELDS) values[field] = raw[field] ?? "";
  return values;
}
