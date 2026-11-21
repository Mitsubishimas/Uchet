import { appDataPath } from "@iskra/apps";
import { DatabaseSync } from "node:sqlite";
import type { Delivery, Order, OrderDraft, OrderStatus } from "./domain.js";

const db = new DatabaseSync(appDataPath("orders.sqlite"));

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY,
    created_at TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    car TEXT NOT NULL DEFAULT '',
    vin TEXT NOT NULL DEFAULT '',
    engine TEXT NOT NULL DEFAULT '',
    gearbox TEXT NOT NULL DEFAULT '',
    power_hp REAL,
    torque_nm REAL,
    consumption REAL,
    vmax REAL,
    spec_notes TEXT NOT NULL DEFAULT '',
    item_firmware INTEGER NOT NULL DEFAULT 0,
    item_ecu INTEGER NOT NULL DEFAULT 0,
    amount_cents INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'created',
    delivery TEXT NOT NULL DEFAULT 'cdek'
  )
`);

interface OrderRow {
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
  readonly item_firmware: number;
  readonly item_ecu: number;
  readonly amount_cents: number;
  readonly status: string;
  readonly delivery: string;
}

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    created_at: row.created_at,
    customer_name: row.customer_name,
    phone: row.phone,
    email: row.email,
    car: row.car,
    vin: row.vin,
    engine: row.engine,
    gearbox: row.gearbox,
    power_hp: row.power_hp,
    torque_nm: row.torque_nm,
    consumption: row.consumption,
    vmax: row.vmax,
    spec_notes: row.spec_notes,
    item_firmware: row.item_firmware === 1,
    item_ecu: row.item_ecu === 1,
    amount_cents: row.amount_cents,
    status: row.status as OrderStatus,
    delivery: row.delivery as Delivery,
  };
}

export function listOrders(): Order[] {
  const rows = db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC, id DESC")
    .all() as unknown as OrderRow[];
  return rows.map(toOrder);
}

export function getOrder(id: number): Order | undefined {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(id) as unknown as
    | OrderRow
    | undefined;
  return row ? toOrder(row) : undefined;
}

export function createOrder(draft: OrderDraft): Order {
  const result = db
    .prepare(
      `INSERT INTO orders (created_at, customer_name, phone, email, car, vin, engine, gearbox,
         power_hp, torque_nm, consumption, vmax, spec_notes, item_firmware, item_ecu,
         amount_cents, status, delivery)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      draft.created_at,
      draft.customer_name,
      draft.phone,
      draft.email,
      draft.car,
      draft.vin,
      draft.engine,
      draft.gearbox,
      draft.power_hp,
      draft.torque_nm,
      draft.consumption,
      draft.vmax,
      draft.spec_notes,
      draft.item_firmware ? 1 : 0,
      draft.item_ecu ? 1 : 0,
      draft.amount_cents,
      draft.status,
      draft.delivery,
    );
  return { id: Number(result.lastInsertRowid), ...draft };
}

/** Обновляет запись целиком: карточка редактируется одной формой. */
export function updateOrder(id: number, draft: OrderDraft): boolean {
  const result = db
    .prepare(
      `UPDATE orders SET created_at = ?, customer_name = ?, phone = ?, email = ?, car = ?,
         vin = ?, engine = ?, gearbox = ?, power_hp = ?, torque_nm = ?, consumption = ?,
         vmax = ?, spec_notes = ?, item_firmware = ?, item_ecu = ?, amount_cents = ?,
         status = ?, delivery = ?
       WHERE id = ?`,
    )
    .run(
      draft.created_at,
      draft.customer_name,
      draft.phone,
      draft.email,
      draft.car,
      draft.vin,
      draft.engine,
      draft.gearbox,
      draft.power_hp,
      draft.torque_nm,
      draft.consumption,
      draft.vmax,
      draft.spec_notes,
      draft.item_firmware ? 1 : 0,
      draft.item_ecu ? 1 : 0,
      draft.amount_cents,
      draft.status,
      draft.delivery,
      id,
    );
  return Number(result.changes) > 0;
}

export function deleteOrder(id: number): boolean {
  const result = db.prepare("DELETE FROM orders WHERE id = ?").run(id);
  return Number(result.changes) > 0;
}
/** Меняет только статус и метод доставки: быстрые действия в карточке. */
export function updateOrderMeta(id: number, status: OrderStatus, delivery: Delivery): boolean {
  const result = db
    .prepare("UPDATE orders SET status = ?, delivery = ? WHERE id = ?")
    .run(status, delivery, id);
  return Number(result.changes) > 0;
}
