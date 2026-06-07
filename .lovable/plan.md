
# Перенос Lana Stone на Timeweb Cloud — полная техническая справка

## 0. Состояние превью

Dev-сервер Vite сейчас работает штатно (`VITE v7.3.1 ready`, порт 8080, ошибок в консоли браузера нет). Если на скрине у тебя пустой/белый превью — это кэш после правок `package.json` и `Dockerfile`. Нужно сделать **жёсткое обновление** в окне превью (Ctrl/Cmd+Shift+R). Никаких правок в коде для починки превью не требуется. Если после жёсткого обновления всё равно белый экран — пришли скрин консоли (F12 → Console), починим точечно.

---

## 1. Стек проекта

**Frontend + Backend в одном приложении (SSR full-stack):**
- **Framework:** TanStack Start v1 (React 19 + TanStack Router v1)
- **Сборщик:** Vite 7
- **SSR-сервер:** Nitro v2 (preset `node-server`) — это и есть backend, генерирует обычный Node HTTP-сервер
- **Стили:** Tailwind CSS v4 (через `@tailwindcss/vite`)
- **UI:** shadcn/ui (Radix UI primitives) + lucide-react
- **Формы:** react-hook-form + zod
- **HTTP/state:** TanStack Query

**Backend-логика живёт внутри того же приложения** двумя способами:
- `createServerFn` из `@tanstack/react-start` — типизированные RPC (используется для AI-примерки)
- Server Routes (`createFileRoute` с блоком `server`) под `src/routes/api/public/*` — обычные HTTP endpoints (используется для лид-формы и заказа)

**Чего НЕТ:**
- ❌ Next.js, Express, Nuxt
- ❌ Supabase Edge Functions (хотя сам клиент Supabase подключён, БД и Edge Functions фактически НЕ используются — см. п. 7)
- ❌ Базы данных, авторизации, файлового хранилища

**Критичные npm-пакеты:**
- `@tanstack/react-start`, `@tanstack/react-router`, `@tanstack/nitro-v2-vite-plugin` — фреймворк и SSR
- `@lovable.dev/vite-tanstack-config` — пресет Vite (можно оставить, он публичный)
- `react`, `react-dom` v19
- `vite` v7, `tailwindcss` v4, `@tailwindcss/vite`
- `zod` — валидация входа API
- `react-hook-form`, `@hookform/resolvers`
- Radix UI пакеты, `lucide-react`, `sonner`

---

## 2. Структура проекта

```
.
├── Dockerfile                       # production-образ для Timeweb (Node 22 + Nitro)
├── .dockerignore
├── vite.config.ts                   # Vite + Nitro v2 (preset: node-server)
├── package.json
├── README-DEPLOY.md                 # отдельная инструкция по деплою
├── .env.example                     # шаблон переменных окружения
└── src/
    ├── router.tsx                   # бутстрап TanStack Router
    ├── routeTree.gen.ts             # авто-генерится, НЕ редактировать
    ├── styles.css                   # Tailwind + design tokens
    ├── routes/
    │   ├── __root.tsx               # корневой layout (html/head/body)
    │   ├── index.tsx                # главная страница "/"
    │   └── api/public/              # ВСЕ HTTP API endpoints
    │       ├── health.ts            # GET /api/public/health
    │       ├── lead.ts              # POST /api/public/lead  (лид-форма)
    │       └── order.ts             # POST /api/public/order (заказ)
    ├── lib/
    │   ├── tryon.functions.ts       # createServerFn — AI-примерка (OpenRouter)
    │   ├── products.ts              # каталог украшений (данные)
    │   ├── phoneValidation.ts
    │   └── utils.ts
    ├── components/
    │   ├── lana/                    # доменные компоненты (Landing, TryOnSection,
    │   │   │                          LeadDialog, OrderDialog, RequestDialog, Logo)
    │   └── ui/                      # shadcn/ui компоненты
    ├── hooks/
    ├── assets/                      # картинки, импортируются как ES-модули
    └── integrations/supabase/       # клиенты Supabase (фактически не нужны, см. п. 7)
```

**Где что:**
| Что | Где |
|---|---|
| Главная страница (UI) | `src/routes/index.tsx` → `src/components/lana/Landing.tsx` |
| AI-примерка (генерация изображения) | `src/lib/tryon.functions.ts` |
| Лид-форма (email) | `src/routes/api/public/lead.ts` |
| Форма заказа (email) | `src/routes/api/public/order.ts` |
| Healthcheck | `src/routes/api/public/health.ts` |
| UI формы | `src/components/lana/LeadDialog.tsx`, `OrderDialog.tsx`, `RequestDialog.tsx`, `TryOnSection.tsx` |

---

## 3. Команды

| Команда | Назначение |
|---|---|
| `npm install --legacy-peer-deps` | установка зависимостей (флаг обязателен из-за React 19) |
| `npm run dev` | dev-сервер Vite (порт 8080) |
| `npm run build` | production-сборка → создаёт **`.output/`** |
| `npm start` | запуск prod-сервера: `node .output/server/index.mjs` |
| `npm run lint` | ESLint |

**Папка сборки:** `.output/`
- `.output/server/index.mjs` — Node HTTP-сервер (entry point)
- `.output/public/` — статические ассеты

---

## 4. Переменные окружения

**Серверные (секретные, в `process.env`, НЕ попадают в браузер):**
| Переменная | Назначение |
|---|---|
| `OPENROUTER_API_KEY` | ключ OpenRouter для AI-примерки украшений (Gemini image) |
| `RESEND_API_KEY_DIRECT` | ключ Resend для отправки писем с лид-формы и заказов |
| `PORT` | порт Node-сервера (по умолчанию 3000) |
| `HOST` | хост Node-сервера (`0.0.0.0` для контейнера) |

**Клиентские/билд-тайм (`import.meta.env.VITE_*`) — фактически НЕ используются runtime-логикой, но присутствуют в `.env`:**
| Переменная | Назначение |
|---|---|
| `VITE_SUPABASE_URL` | URL Supabase (наследие Lovable Cloud, можно удалить — см. п. 7) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | публичный anon-ключ Supabase (наследие, можно удалить) |
| `VITE_SUPABASE_PROJECT_ID` | ID проекта Supabase (наследие, можно удалить) |

**Захардкоженных секретов в коде НЕТ** (см. п. 10).

Адрес получателя писем (`lanastonevrn@gmail.com`) сейчас захардкожен в `lead.ts` и `order.ts` константой `RECIPIENT`. Если хочешь — можно вынести в переменную `ADMIN_EMAIL` (мелкая правка на этапе build).

---

## 5. Как работает генерация изображений (AI-примерка)

- **Файл:** `src/lib/tryon.functions.ts`
- **Тип:** `createServerFn({ method: "POST" })` — типизированный RPC, вызывается с фронта через `useServerFn(generateTryOn)`
- **API:** OpenRouter `POST https://openrouter.ai/api/v1/chat/completions`
- **Модель:** `google/gemini-2.5-flash-image`
- **Что отправляется:**
  - prompt-инструкция (на английском, описывает как естественно "надеть" украшение)
  - 2 картинки в `messages[0].content` как `image_url`: фото пользователя + фото украшения (передаются как **data URL** или https-URL)
  - `modalities: ["image", "text"]`
- **Заголовки:** `Authorization: Bearer ${OPENROUTER_API_KEY}`, `HTTP-Referer`, `X-Title`
- **Ретраи:** до 3 попыток на 5xx с экспоненциальной задержкой
- **Обработка ошибок:** 429 → "слишком много запросов", 402 → "лимит исчерпан"
- **Где хранится ключ:** `process.env.OPENROUTER_API_KEY` (server-only)
- **Формат ответа:** возвращается `data URL` (base64-encoded PNG/JPEG) из `json.choices[0].message.images[0].image_url.url`. Сохранения в storage НЕТ — картинка только показывается пользователю в браузере.

---

## 6. Как работает лид-форма

**Два endpoint'а, оба отправляют письмо через Resend:**

### `POST /api/public/lead` — простая заявка (`src/routes/api/public/lead.ts`)
Поля (валидируются через zod):
- `name` (2-100 символов, обяз.)
- `contact` (3-200, обяз.)
- `channel` enum: `whatsapp` | `telegram` | `phone` | `email` | `any`
- `message` (опц., до 2000)
- `product_ref` (опц., до 200)

### `POST /api/public/order` — заказ (`src/routes/api/public/order.ts`)
Поля:
- `firstName`, `lastName`, `phone`, `city`, `contact`, `comment`
- `consent: true` (обязательное согласие на обработку ПД)
- `items: Array<{ name, price }>` (1-20 позиций)

**Как уходит письмо:**
- HTTP `POST https://api.resend.com/emails` с `Authorization: Bearer ${RESEND_API_KEY_DIRECT}`
- `from: "Lana Stone <onboarding@resend.dev>"` (тестовый домен Resend — для prod лучше подключить свой домен)
- `to: ["lanastonevrn@gmail.com"]` (захардкожено в константе `RECIPIENT`)
- `reply_to` подставляется, если `contact` содержит `@`
- HTML письма формируется inline в коде; пользовательский ввод экранируется через `escapeHtml`

**Письмо пользователю:** НЕТ. Только админу.
**Валидация:** zod (длина, формат, enum). Все строки экранируются (XSS-защита в HTML письма).
**Антиспам:** rate-limit'а нет, капчи нет. На Timeweb можно докрутить, если будет спам.

---

## 7. Зависимости от Lovable Cloud

| Что | Используется? | Действие при переносе |
|---|---|---|
| Lovable Cloud functions | ❌ нет | — |
| Supabase Edge Functions | ❌ нет | — |
| Supabase БД / Auth / Storage | ❌ нет (клиент подключён в `src/integrations/supabase/`, но не вызывается из runtime-кода) | можно оставить пакет — не мешает; либо удалить `@supabase/supabase-js` и папку `src/integrations/supabase/`, и убрать `VITE_SUPABASE_*` из `.env` |
| Lovable secrets | ✅ `OPENROUTER_API_KEY`, `RESEND_API_KEY_DIRECT` | завести как переменные окружения на Timeweb |
| Lovable AI Gateway | ❌ (используется напрямую OpenRouter) | — |
| Внешние интеграции | OpenRouter, Resend — оба обычные публичные API | работают одинаково с любого хостинга |

**Вывод:** проект полностью самодостаточен. Никаких runtime-вызовов к Lovable/Supabase нет.

---

## 8. Рекомендации для Timeweb Cloud

**Тип приложения: full-stack Node.js приложение** (или Docker-контейнер — Dockerfile уже готов).

### Вариант A — нативный Node.js на Timeweb
- **Build command:** `npm install --legacy-peer-deps && npm run build`
- **Start command:** `node .output/server/index.mjs` (или `npm start`)
- **Build output / папка артефактов:** `.output`
- **Порт:** `3000`
- **Healthcheck path:** `/` (или `/api/public/health`)
- **Node.js версия:** 22.x

### Вариант B — Docker (рекомендую, всё уже готово)
- Используется `Dockerfile` из корня
- Базовый образ: `node:22-alpine`
- Внутренний порт: `3000`
- Healthcheck встроен в Dockerfile

### Переменные окружения на Timeweb:
```
OPENROUTER_API_KEY=sk-or-v1-...
RESEND_API_KEY_DIRECT=re_...
PORT=3000
HOST=0.0.0.0
NODE_ENV=production
```
(Опционально `VITE_SUPABASE_*` — если решишь оставить интеграцию Supabase. Если удалить — не нужны.)

### Endpoints, которые должны работать после деплоя:
- `GET /` — главная (SSR React)
- `GET /api/public/health` — healthcheck
- `POST /api/public/lead` — лид-форма
- `POST /api/public/order` — заказ
- `POST /_serverFn/...` — RPC AI-примерки (вызывается автоматически из браузера)
- `GET /_build/*`, `GET /assets/*` — статика

---

## 9. Безопасность ключей — структура уже правильная

Архитектура уже соответствует требованию "ключи только на сервере":

```
Браузер ──HTTPS──► наш Node-сервер (Nitro) ──HTTPS──► OpenRouter / Resend
                   ▲
                   └─ здесь лежат OPENROUTER_API_KEY и RESEND_API_KEY_DIRECT
                      (process.env, в браузер не попадают)
```

- AI-примерка: фронт вызывает `generateTryOn` (RPC к нашему серверу) → сервер обращается к OpenRouter
- Лид-форма: фронт делает `fetch('/api/public/lead')` → сервер обращается к Resend
- Ни одного `fetch('https://openrouter.ai/...')` или `fetch('https://api.resend.com/...')` из браузера нет
- Vite-плагин TanStack блокирует импорт `*.server.ts` и `process.env` секретов в клиентский бандл

**Ничего дополнительно делать не надо.** Структура безопасна by design.

---

## 10. Аудит на утечку API-ключей

| Проверка | Результат |
|---|---|
| Ключи в frontend-коде (`src/components/`, `src/routes/index.tsx`, …) | ✅ не найдено |
| Ключи захардкожены в репозитории | ✅ не найдено |
| Секреты в `VITE_*` переменных | ✅ только публичный Supabase anon key (он по дизайну публичный, не секрет) |
| `OPENROUTER_API_KEY` / `RESEND_API_KEY_DIRECT` | ✅ только `process.env`, читаются внутри `.handler()` server-функций |
| `.env` в `.gitignore` | нужно проверить — должно быть `.env` исключено (`.env.example` коммитим) |

**Что сделать перед деплоем:**
1. Убедиться, что `.env` (с реальными значениями) **не закоммичен** в git. В репозитории должен быть только `.env.example`.
2. На Timeweb прописать `OPENROUTER_API_KEY` и `RESEND_API_KEY_DIRECT` через UI переменных окружения, а не файлом.
3. (Опц.) удалить `VITE_SUPABASE_*` из `.env` и саму папку `src/integrations/supabase/`, если решишь полностью убрать наследие Supabase.
4. Заменить тестовый Resend-отправитель `onboarding@resend.dev` на свой верифицированный домен в Resend (иначе письма могут попадать в спам / иметь ограничение по rate).

---

## Что я предлагаю сделать в режиме build

1. Не трогать код — превью почистится после Ctrl+Shift+R; если белый экран останется, починю по логам из консоли.
2. (Опц., по твоему желанию) вынести email-получателя в переменную `ADMIN_EMAIL` вместо хардкода `lanastonevrn@gmail.com` — удобнее для тестов на staging.
3. (Опц.) удалить неиспользуемые `VITE_SUPABASE_*` и папку `src/integrations/supabase/`, чтобы не путать разработчика на Timeweb.

Скажи, какие из опциональных пунктов делать — и я переключусь в build mode и выполню.
