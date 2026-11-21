import type { AppStyle } from "@iskra/apps";

// Имя и стиль нового проекта задаёт SDK init.
export const APP_NAME = "uchet-mastermitsu";
export const APP_STYLE: AppStyle = "strict";

/** Часовой пояс, в котором считаются «сегодня», неделя и месяц. */
export const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Novosibirsk";