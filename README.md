# Учёт заказов MasterMitsu

Приватное веб-приложение учёта заказов (прошивки ECU / блоки управления) для **MasterMitsu**.

Собрано для платформы **Искра** (`@iskra/apps` + Hono + SQLite).

Репозиторий: https://github.com/Mitsubishimas/Uchet

---

## Что внутри

| Папка / файл | Назначение |
|--------------|------------|
| `src/` | Исходники TypeScript |
| `static/` | CSS, логотип, клиентский JS |
| `runtime/` | **Готовый собранный бандл** (можно запускать сразу) |
| `app.json` | Манифест приложения Искры |
| `start.sh` | Скрипт локального запуска |

### Возможности

- Список заказов с поиском
- Создание / редактирование / удаление
- Статусы: Создан → Оплачен → Отгружен
- Доставка: Почта / Сайт / СДЭК
- Аналитика за неделю и месяц (KPI, разбивки)
- Выгрузка CSV

---

## Быстрый запуск (Codespaces / локально)

Приложение уже собрано в папке `runtime/`. SDK `@iskra/apps` **вшит** в `runtime/server.js`, поэтому отдельная установка пакета не нужна.

### 1. GitHub Codespaces

1. Откройте https://github.com/Mitsubishimas/Uchet  
2. **Code → Codespaces → Create codespace on main**  
3. В терминале:

```bash
./start.sh
# или
npm start
```

4. Codespaces предложит «Open in Browser» для порта **8080**.

### 2. Локально (Node.js ≥ 22)

```bash
git clone https://github.com/Mitsubishimas/Uchet.git
cd Uchet
./start.sh
# → http://localhost:8080
```

Скрипт `start.sh` сам выставляет нужные переменные:

| Переменная | По умолчанию | Описание |
|------------|--------------|----------|
| `DATA_DIR` | `./data` | Абсолютный путь к папке SQLite |
| `APP_BASE_PATH` | `/` | Базовый URL-путь |
| `PORT` | `8080` | Порт |
| `APP_TIMEZONE` | `Asia/Novosibirsk` | Часовой пояс дат |

Данные: `$DATA_DIR/orders.sqlite`.

---

## Как залить в ваш репозиторий

Если репозиторий ещё пустой:

```bash
# скачайте архив Uchet-github-ready.zip и распакуйте,
# либо скопируйте содержимое папки Uchet

cd Uchet
git init
git remote add origin https://github.com/Mitsubishimas/Uchet.git
git add .
git commit -m "Initial: uchet-mastermitsu source + runtime"
git branch -M main
git push -u origin main
```

После пуша можно сразу открыть Codespace.

---

## Структура исходников

```
src/
  config.ts     — имя, стиль, часовой пояс
  domain.ts     — модель заказа, статусы, аналитика, форматтеры
  form.ts       — разбор и валидация формы
  storage.ts    — SQLite CRUD
  views.ts      — HTML-экраны
  routes.ts     — маршруты Hono
  server.ts     — точка входа
```

---

## Публикация обратно в платформу Искра

### A. Загрузить runtime-архив

```bash
cd runtime
zip -r ../uchet-mastermitsu-runtime-1.0.0.zip .
```

В интерфейсе Искры: **Приложения → Загрузить архив**.  
Версия берётся из `app.json`.

### B. CLI `iskra-app` (нужен SDK и ключ с правом `apps:publish`)

```bash
iskra-app check
iskra-app pack
iskra-app publish
```

### C. Через чат Искры

Прикрепите zip исходников (`src` + `static` + `app.json`) и попросите опубликовать.

---

## Разработка

1. Правите `src/` и `static/`.  
2. Новый runtime получается только в среде с `@iskra/apps` (`iskra-app pack` / сборка платформы).  
3. Текущий `runtime/server.js` не подхватывает изменения из `src/` автоматически.

Проверка типов (без SDK будет ошибка на `@iskra/apps` — ожидаемо):

```bash
npm install
npx tsc --noEmit
```

---

## Технологии

- Hono + `@hono/node-server`
- SQLite (`node:sqlite`, Node 22+)
- `@iskra/apps` — оболочка страниц, CSP, base path, путь к данным
- Стиль UI: `strict`
