import { appPage, appTitle, escapeHTML } from "@iskra/apps";
import type { Context } from "hono";
import { APP_NAME, APP_STYLE } from "./config.js";
import {
  DELIVERIES,
  DELIVERY_LABELS,
  STATUSES,
  STATUS_LABELS,
  formatDate,
  formatMoney,
  formatNumber,
  itemsLabel,
  type AnalyticsPeriod,
  type Order,
} from "./domain.js";
import type { FormValues } from "./form.js";

const STATUS_BADGE: Record<Order["status"], string> = {
  created: "badge",
  paid: "badge badge--accent",
  shipped: "badge badge--success",
};

const head = `<link rel="icon" href="favicon.png" type="image/png" />
    <link rel="stylesheet" href="app.css" />
    <script src="screen.js" defer></script>`;

/** Шапка-логотип: заставка пользователя, уменьшенная до строки заголовка. */
const logotype = `<img class="logotype" src="logo.png" alt="MasterMitsu" width="128" height="64" />`;

function shell(
  context: Context,
  section: "orders" | "analytics",
  body: string,
  wide = false,
): string {
  return appPage({
    title: appTitle(context.req.raw, APP_NAME),
    request: context.req.raw,
    style: APP_STYLE,
    head,
    wide,
    nav: [
      { href: "./?section=orders", label: "Заказы", current: section === "orders" },
      { href: "./?section=analytics", label: "Аналитика", current: section === "analytics" },
    ],
    body,
  });
}

function statusBadge(order: Order): string {
  return `<span class="${STATUS_BADGE[order.status]}">${STATUS_LABELS[order.status]}</span>`;
}

function listItem(order: Order, selectedId: number | null): string {
  const current = order.id === selectedId ? ' aria-current="true"' : "";
  return `<a class="list-select__item order-row" href="./?section=orders&amp;id=${order.id}"${current}>
      <span class="order-row__top"><span class="order-row__name">${escapeHTML(order.customer_name)}</span>${statusBadge(order)}</span>
      <span class="order-row__meta">${escapeHTML(order.car || "Автомобиль не указан")}</span>
      <span class="order-row__meta"><span>${formatDate(order.created_at)}</span><span class="num">${formatMoney(order.amount_cents)}</span></span>
    </a>`;
}

function pair(label: string, value: string): string {
  return `<tr><th>${escapeHTML(label)}</th><td>${value || '<span class="is-empty">—</span>'}</td></tr>`;
}

function detailCard(order: Order): string {
  const consumption =
    order.consumption === null ? "—" : `${formatNumber(order.consumption)} л/100 км`;
  return `
    <section class="card card--pad stack">
      <div class="order-head">
        <div>
          <h2 class="order-head__title">${escapeHTML(order.customer_name)}</h2>
          <p class="hint">Заказ №${order.id} от ${formatDate(order.created_at)}</p>
        </div>
        ${statusBadge(order)}
      </div>

      <div class="kpis">
        <div class="kpi"><span class="kpi__label">Сумма</span><span class="kpi__value">${formatMoney(order.amount_cents)}</span></div>
        <div class="kpi"><span class="kpi__label">Позиции</span><span class="kpi__value kpi__value--text">${escapeHTML(itemsLabel(order))}</span></div>
        <div class="kpi"><span class="kpi__label">Доставка</span><span class="kpi__value kpi__value--text">${DELIVERY_LABELS[order.delivery]}</span></div>
      </div>

      <h3 class="section__title">Покупатель</h3>
      <table class="pairs"><tbody>
        ${pair("Телефон", escapeHTML(order.phone))}
        ${pair("E-mail", escapeHTML(order.email))}
        ${pair("Автомобиль", escapeHTML(order.car))}
        ${pair("VIN", escapeHTML(order.vin))}
      </tbody></table>

      <h3 class="section__title">Прошивка</h3>
      <table class="pairs"><tbody>
        ${pair("Двигатель", escapeHTML(order.engine))}
        ${pair("Коробка передач", escapeHTML(order.gearbox))}
        ${pair("Мощность", formatNumber(order.power_hp, " л.с."))}
        ${pair("Момент", formatNumber(order.torque_nm, " Н·м"))}
        ${pair("Расход", consumption)}
        ${pair("Максимальная скорость", formatNumber(order.vmax, " км/ч"))}
        ${pair("Комментарий", order.spec_notes ? `<span class="notes">${escapeHTML(order.spec_notes)}</span>` : "")}
      </tbody></table>

      <h3 class="section__title">Статус и доставка</h3>
      <form class="toolbar" method="post" action="orders/${order.id}/meta">
        <label class="field field--inline">
          <span class="field__label">Статус</span>
          <select name="status">
            ${STATUSES.map(
              (status) =>
                `<option value="${status}"${status === order.status ? " selected" : ""}>${STATUS_LABELS[status]}</option>`,
            ).join("")}
          </select>
        </label>
        <label class="field field--inline">
          <span class="field__label">Доставка</span>
          <select name="delivery">
            ${DELIVERIES.map(
              (delivery) =>
                `<option value="${delivery}"${delivery === order.delivery ? " selected" : ""}>${DELIVERY_LABELS[delivery]}</option>`,
            ).join("")}
          </select>
        </label>
        <button class="btn-primary">Сохранить</button>
      </form>

      <div class="actions">
        <a class="btn-link" href="./?section=edit&amp;id=${order.id}">Изменить заказ</a>
        <a class="btn-link" href="./?section=new">Новый заказ</a>
        <form method="post" action="orders/${order.id}/delete" data-confirm="Удалить заказ №${order.id}? Действие необратимо.">
          <button class="btn-danger">Удалить</button>
        </form>
      </div>
    </section>`;
}

export interface OrdersView {
  readonly orders: readonly Order[];
  readonly selected: Order | undefined;
  readonly filter: string;
  readonly notice: string;
  readonly error: string;
}

export function ordersScreen(context: Context, view: OrdersView): string {
  const needle = view.filter.trim().toLowerCase();
  const rows = needle
    ? view.orders.filter((order) =>
        [order.customer_name, order.car, order.vin, order.phone, order.engine]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      )
    : view.orders;

  const list = rows.length
    ? rows.map((order) => listItem(order, view.selected?.id ?? null)).join("")
    : `<p class="empty">${needle ? "Ничего не найдено. Измените запрос." : "Заказов пока нет. Создайте первый."}</p>`;

  const total = rows.reduce((sum, order) => sum + order.amount_cents, 0);

  const card = view.selected
    ? detailCard(view.selected)
    : `<section class="card card--pad stack">
        <div class="order-head">${logotype}</div>
        <p class="empty">${view.orders.length ? "Выберите заказ в списке слева." : "Первый заказ создаётся кнопкой «Новый заказ»."}</p>
        <p class="actions"><a class="btn-link btn-link--primary" href="./?section=new">Новый заказ</a></p>
      </section>`;

  return shell(
    context,
    "orders",
    `${
      view.notice ? `<p class="status status--ok" role="status">${escapeHTML(view.notice)}</p>` : ""
    }${view.error ? `<p class="status status--error" role="status">${escapeHTML(view.error)}</p>` : ""}
    <div class="split">
      <div class="stack">
        <form class="card card--pad stack" method="get">
          <input type="hidden" name="section" value="orders" />
          <label class="field">
            <span class="field__label">Поиск по заказам</span>
            <input name="filter" value="${escapeHTML(view.filter)}" placeholder="Имя, автомобиль, VIN" />
          </label>
          <div class="actions">
            <button>Найти</button>
            <a class="btn-link" href="./?section=orders">Сбросить</a>
          </div>
        </form>
        <p class="list-total">Заказов: <strong>${rows.length}</strong> · на сумму <strong>${formatMoney(total)}</strong></p>
        <nav class="list-select" aria-label="Заказы">${list}</nav>
        <p class="actions"><a class="btn-link btn-link--primary" href="./?section=new">Новый заказ</a></p>
      </div>
      ${card}
    </div>`,
  );
}

function field(
  label: string,
  name: string,
  values: FormValues,
  options: {
    type?: string;
    placeholder?: string;
    wide?: boolean;
    inputmode?: string;
    min?: string;
    step?: string;
  } = {},
): string {
  const value = values[name] ?? "";
  return `<label class="field${options.wide ? " field--wide" : ""}">
      <span class="field__label">${escapeHTML(label)}</span>
      <input name="${name}" type="${options.type ?? "text"}" value="${escapeHTML(value)}"${
        options.placeholder ? ` placeholder="${escapeHTML(options.placeholder)}"` : ""
      }${options.inputmode ? ` inputmode="${options.inputmode}"` : ""}${
        options.min ? ` min="${options.min}"` : ""
      }${options.step ? ` step="${options.step}"` : ""} />
    </label>`;
}

function select(
  label: string,
  name: string,
  values: FormValues,
  options: readonly { value: string; label: string }[],
): string {
  const value = values[name] ?? "";
  return `<label class="field">
      <span class="field__label">${escapeHTML(label)}</span>
      <select name="${name}">${options
        .map(
          (option) =>
            `<option value="${option.value}"${option.value === value ? " selected" : ""}>${escapeHTML(option.label)}</option>`,
        )
        .join("")}</select>
    </label>`;
}

function check(label: string, name: string, values: FormValues): string {
  const checked = values[name] ? " checked" : "";
  return `<label class="check"><input type="checkbox" name="${name}"${checked} /> <span>${escapeHTML(label)}</span></label>`;
}

export interface FormView {
  readonly mode: "new" | "edit";
  readonly values: FormValues;
  readonly errors: readonly string[];
  readonly orderId?: number;
}

export function formScreen(context: Context, view: FormView): string {
  const action = view.mode === "edit" ? `orders/${view.orderId}` : "orders";
  const title = view.mode === "edit" ? `Заказ №${view.orderId}` : "Новый заказ";
  const statusOptions = STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] }));
  const deliveryOptions = DELIVERIES.map((delivery) => ({
    value: delivery,
    label: DELIVERY_LABELS[delivery],
  }));
  const back = `./?section=orders${view.orderId ? `&amp;id=${view.orderId}` : ""}`;

  return shell(
    context,
    "orders",
    `<section class="card card--pad stack">
      <div class="order-head">
        <h2 class="order-head__title">${escapeHTML(title)}</h2>
        <a class="btn-link" href="${back}">К списку</a>
      </div>
      ${
        view.errors.length
          ? `<p class="status status--error" role="alert">${escapeHTML(view.errors.join(" "))}</p>`
          : ""
      }
      <form class="stack" method="post" action="${action}">
        <h3 class="section__title">Заказ</h3>
        <div class="fields-grid">
          ${field("Дата заказа", "created_at", view.values, { type: "date" })}
          ${field("Сумма, ₽", "amount", view.values, { placeholder: "45 000,50", inputmode: "decimal" })}
          ${select("Статус", "status", view.values, statusOptions)}
          ${select("Метод доставки", "delivery", view.values, deliveryOptions)}
        </div>
        <h3 class="section__title">Покупатель</h3>
        <div class="fields-grid">
          ${field("Имя покупателя", "customer_name", view.values, { placeholder: "Иван Петров" })}
          ${field("Телефон", "phone", view.values, { placeholder: "+7 913 000-00-00" })}
          ${field("E-mail", "email", view.values, { type: "email", placeholder: "client@example.ru", wide: true })}
          ${field("Автомобиль", "car", view.values, { placeholder: "BMW X5 G05 3.0d", wide: true })}
          ${field("VIN", "vin", view.values, { placeholder: "17 символов", wide: true })}
        </div>
        <h3 class="section__title">Прошивка</h3>
        <div class="fields-grid">
          ${field("Двигатель", "engine", view.values, { placeholder: "3.0d B57" })}
          ${field("Коробка передач", "gearbox", view.values, { placeholder: "ZF 8HP" })}
          ${field("Мощность, л.с.", "power_hp", view.values, { inputmode: "decimal" })}
          ${field("Момент, Н·м", "torque_nm", view.values, { inputmode: "decimal" })}
          ${field("Расход, л/100 км", "consumption", view.values, { inputmode: "decimal" })}
          ${field("Максимальная скорость, км/ч", "vmax", view.values, { inputmode: "decimal" })}
        </div>
        <label class="field">
          <span class="field__label">Комментарий к характеристикам</span>
          <textarea name="spec_notes" rows="3" placeholder="Stage 1, замеры до и после, особенности">${escapeHTML(view.values.spec_notes ?? "")}</textarea>
        </label>
        <h3 class="section__title">Позиции заказа</h3>
        <div class="checks">
          ${check("Прошивка", "item_firmware", view.values)}
          ${check("Блок управления", "item_ecu", view.values)}
        </div>
        <div class="actions">
          <button class="btn-primary">${view.mode === "edit" ? "Сохранить изменения" : "Создать заказ"}</button>
          <a class="btn-link" href="${back}">Отмена</a>
        </div>
      </form>
    </section>`,
  );
}

function breakdown(
  title: string,
  rows: readonly { label: string; count: number; sum_cents: number }[],
): string {
  return `<div class="card card--pad stack">
      <h3 class="section__title">${escapeHTML(title)}</h3>
      <div class="table-wrap"><table>
        <thead><tr><th>Значение</th><th class="num">Заказов</th><th class="num">Сумма</th></tr></thead>
        <tbody>${rows
          .map(
            (row) =>
              `<tr><td>${escapeHTML(row.label)}</td><td class="num">${row.count}</td><td class="num">${formatMoney(row.sum_cents)}</td></tr>`,
          )
          .join("")}</tbody>
      </table></div>
    </div>`;
}

function periodBlock(period: AnalyticsPeriod): string {
  const range =
    period.period.from === period.period.to
      ? formatDate(period.period.from)
      : `${formatDate(period.period.from)} — ${formatDate(period.period.to)}`;
  return `<section class="stack">
      <div class="toolbar">
        <h2 class="order-head__title">${escapeHTML(period.title)}</h2>
        <span class="hint">${range}</span>
        <a class="btn-link" href="export.csv?period=${period.key}">Выгрузить CSV</a>
      </div>
      <div class="kpis">
        <div class="kpi"><span class="kpi__label">Сумма</span><span class="kpi__value">${formatMoney(period.sum_cents)}</span></div>
        <div class="kpi"><span class="kpi__label">Заказов</span><span class="kpi__value">${period.count}</span></div>
        <div class="kpi"><span class="kpi__label">Средний чек</span><span class="kpi__value">${formatMoney(period.average_cents)}</span></div>
        <div class="kpi"><span class="kpi__label">Оплачено и отгружено</span><span class="kpi__value">${formatMoney(period.earned_cents)}</span></div>
      </div>
      <div class="breakdowns">
        ${breakdown("По статусам", period.byStatus)}
        ${breakdown("По методам доставки", period.byDelivery)}
      </div>
    </section>`;
}

export function analyticsScreen(
  context: Context,
  week: AnalyticsPeriod,
  month: AnalyticsPeriod,
  recent: readonly Order[],
): string {
  const latest = recent.length
    ? `<div class="card card--pad stack">
        <h3 class="section__title">Последние заказы месяца</h3>
        <div class="table-wrap"><table>
          <thead><tr><th>Дата</th><th>Покупатель</th><th>Позиции</th><th>Доставка</th><th>Статус</th><th class="num">Сумма</th></tr></thead>
          <tbody>${recent
            .map(
              (order) =>
                `<tr><td>${formatDate(order.created_at)}</td><td><a href="./?section=orders&amp;id=${order.id}">${escapeHTML(order.customer_name)}</a></td><td>${escapeHTML(itemsLabel(order))}</td><td>${DELIVERY_LABELS[order.delivery]}</td><td>${statusBadge(order)}</td><td class="num">${formatMoney(order.amount_cents)}</td></tr>`,
            )
            .join("")}</tbody>
        </table></div>
      </div>`
    : "";
  return shell(
    context,
    "analytics",
    `<div class="stack">
      ${periodBlock(week)}
      ${periodBlock(month)}
      ${latest}
    </div>`,
    true,
  );
}