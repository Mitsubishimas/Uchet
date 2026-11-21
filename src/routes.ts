import {
  APP_STYLESHEET_PATH,
  appBasePath,
  appStylesheetResponse,
  escapeHTML,
} from "@iskra/apps";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import {
  DELIVERY_LABELS,
  STATUS_LABELS,
  analyticsFor,
  formatDate,
  isDelivery,
  isStatus,
  monthPeriod,
  todayISO,
  weekPeriod,
  type Order,
} from "./domain.js";
import { parseOrderForm, readValues, valuesFromOrder } from "./form.js";
import {
  createOrder,
  deleteOrder,
  getOrder,
  listOrders,
  updateOrder,
  updateOrderMeta,
} from "./storage.js";
import { analyticsScreen, formScreen, ordersScreen } from "./views.js";

/** Префикс адреса приложения без завершающего слэша: "" в корне, иначе "/<slug>". */
function prefix(): string {
  const base = appBasePath();
  return base === "/" ? "" : base;
}

const CSV_COLUMNS: readonly [string, (order: Order) => string][] = [
  ["Номер", (order) => String(order.id)],
  ["Дата", (order) => formatDate(order.created_at)],
  ["Покупатель", (order) => order.customer_name],
  ["Телефон", (order) => order.phone],
  ["E-mail", (order) => order.email],
  ["Автомобиль", (order) => order.car],
  ["VIN", (order) => order.vin],
  ["Двигатель", (order) => order.engine],
  ["Коробка передач", (order) => order.gearbox],
  ["Мощность, л.с.", (order) => (order.power_hp === null ? "" : String(order.power_hp))],
  ["Момент, Н·м", (order) => (order.torque_nm === null ? "" : String(order.torque_nm))],
  ["Расход, л/100 км", (order) => (order.consumption === null ? "" : String(order.consumption))],
  ["Максимальная скорость, км/ч", (order) => (order.vmax === null ? "" : String(order.vmax))],
  ["Комментарий", (order) => order.spec_notes],
  ["Прошивка", (order) => (order.item_firmware ? "да" : "нет")],
  ["Блок управления", (order) => (order.item_ecu ? "да" : "нет")],
  ["Сумма", (order) => (order.amount_cents / 100).toFixed(2).replace(".", ",")],
  ["Статус", (order) => STATUS_LABELS[order.status]],
  ["Доставка", (order) => DELIVERY_LABELS[order.delivery]],
];

function csvCell(value: string): string {
  return `"${value.replace(/\r?\n/g, " ").replace(/"/g, '""')}"`;
}

export function createRoutes(): Hono {
  const ui = new Hono();
  ui.get(`/${APP_STYLESHEET_PATH}`, (context) => appStylesheetResponse(context.req.raw));
  ui.get("/app.css", serveStatic({ root: "./static", path: "app.css" }));
  ui.get("/screen.js", serveStatic({ root: "./static", path: "screen.js" }));
  ui.get("/logo.png", serveStatic({ root: "./static", path: "logo.png" }));
  ui.get("/favicon.png", serveStatic({ root: "./static", path: "favicon.png" }));

  // ── Экраны ────────────────────────────────────────────────────────────────
  ui.get("/", (context) => {
    const section = context.req.query("section") ?? "orders";
    const orders = listOrders();

    if (section === "analytics") {
      const today = todayISO();
      const month = monthPeriod(today);
      const week = weekPeriod(today);
      const recent = orders.filter((order) => order.created_at >= month.from).slice(0, 10);
      return context.html(
        analyticsScreen(
          context,
          analyticsFor(orders, week, "week", "За неделю"),
          analyticsFor(orders, month, "month", "За месяц"),
          recent,
        ),
      );
    }

    if (section === "new") {
      return context.html(formScreen(context, { mode: "new", values: readValues({}), errors: [] }));
    }

    if (section === "edit") {
      const order = getOrder(Number(context.req.query("id")));
      if (!order) return context.redirect(`${prefix()}/?section=orders&error=${encodeURIComponent("Заказ не найден")}`, 303);
      return context.html(
        formScreen(context, {
          mode: "edit",
          values: valuesFromOrder(order),
          errors: [],
          orderId: order.id,
        }),
      );
    }

    const selectedId = Number(context.req.query("id"));
    const selected = Number.isFinite(selectedId) ? getOrder(selectedId) : undefined;
    return context.html(
      ordersScreen(context, {
        orders,
        selected,
        filter: context.req.query("filter") ?? "",
        notice: context.req.query("notice") ?? "",
        error: context.req.query("error") ?? "",
      }),
    );
  });

  // ── Заказы ────────────────────────────────────────────────────────────────
  ui.post("/orders", async (context) => {
    const parsed = parseOrderForm(await context.req.parseBody());
    if (!parsed.draft) {
      return context.html(
        formScreen(context, { mode: "new", values: parsed.values, errors: parsed.errors }),
        422,
      );
    }
    const order = createOrder(parsed.draft);
    return context.redirect(
      `${prefix()}/?section=orders&id=${order.id}&notice=${encodeURIComponent("Заказ создан")}`,
      303,
    );
  });

  ui.post("/orders/:id/meta", async (context) => {
    const id = Number(context.req.param("id"));
    const order = getOrder(id);
    if (!order)
      return context.redirect(
        `${prefix()}/?section=orders&error=${encodeURIComponent("Заказ не найден")}`,
        303,
      );
    const body = (await context.req.parseBody()) as Record<string, unknown>;
    const status = isStatus(body.status) ? body.status : order.status;
    const delivery = isDelivery(body.delivery) ? body.delivery : order.delivery;
    updateOrderMeta(id, status, delivery);
    return context.redirect(
      `${prefix()}/?section=orders&id=${id}&notice=${encodeURIComponent("Статус обновлён")}`,
      303,
    );
  });

  ui.post("/orders/:id/delete", (context) => {
    const id = Number(context.req.param("id"));
    deleteOrder(id);
    return context.redirect(`${prefix()}/?section=orders&notice=${encodeURIComponent("Заказ удалён")}`, 303);
  });

  ui.post("/orders/:id", async (context) => {
    const id = Number(context.req.param("id"));
    if (!getOrder(id))
      return context.redirect(
        `${prefix()}/?section=orders&error=${encodeURIComponent("Заказ не найден")}`,
        303,
      );
    const parsed = parseOrderForm(await context.req.parseBody());
    if (!parsed.draft) {
      return context.html(
        formScreen(context, {
          mode: "edit",
          values: parsed.values,
          errors: parsed.errors,
          orderId: id,
        }),
        422,
      );
    }
    updateOrder(id, parsed.draft);
    return context.redirect(
      `${prefix()}/?section=orders&id=${id}&notice=${encodeURIComponent("Изменения сохранены")}`,
      303,
    );
  });

  // ── Выгрузка CSV ──────────────────────────────────────────────────────────
  ui.get("/export.csv", (context) => {
    const today = todayISO();
    const period =
      (context.req.query("period") ?? "month") === "week" ? weekPeriod(today) : monthPeriod(today);
    const rows = listOrders().filter(
      (order) => order.created_at >= period.from && order.created_at <= period.to,
    );
    const lines = [
      CSV_COLUMNS.map(([title]) => csvCell(title)).join(";"),
      ...rows.map((order) => CSV_COLUMNS.map(([, value]) => csvCell(value(order))).join(";")),
    ];
    const name = `mastermitsu-${period.from}_${period.to}.csv`;
    return new Response(`\uFEFF${lines.join("\r\n")}\r\n`, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="${name}"`,
        "cache-control": "no-store",
      },
    });
  });

  ui.notFound((context) =>
    context.html(
      `<!doctype html><html lang="ru"><body><main><h1>Страница не найдена</h1><p><a href="${escapeHTML(prefix())}/">К заказам</a></p></main></body></html>`,
      404,
    ),
  );

  return ui;
}