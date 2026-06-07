# Развёртывание Lana Stone на Timeweb Cloud (Docker)

Сайт — full-stack приложение на TanStack Start (React 19 SSR + Nitro Node-сервер). Никаких баз данных, авторизации и файлового хранилища. Только две интеграции по HTTPS: **OpenRouter** (AI-примерка) и **Resend** (email-уведомления о заявках).

Деплой выполняется как **Docker-приложение** на Timeweb Cloud Apps.

---

## 1. Что готово в репозитории

| Файл | Назначение |
|---|---|
| `Dockerfile` | двух-этапная сборка Node 22 + Nitro, слушает `0.0.0.0:$PORT` |
| `.dockerignore` | исключает `.env`, `.output`, `node_modules`, и т.п. |
| `scripts/patch-srvx.mjs` | постбилд-патчи для известных багов Nitro v2 beta (срабатывают автоматически в `npm run build`) |
| `.env.example` | шаблон переменных окружения |
| `src/routes/api/public/health.ts` | endpoint для healthcheck Timeweb |

---

## 2. Что подготовить заранее

1. **Аккаунт Timeweb Cloud** и проект уровня "Apps" (Docker).
2. **Домен** (например `lanastone.ru`) — A-запись `@` и `www` на адрес, который Timeweb выдаст после деплоя. SSL Timeweb выпустит автоматически.
3. **Ключи API:**
   - `OPENROUTER_API_KEY` — https://openrouter.ai/keys (пополнить баланс ~$5)
   - `RESEND_API_KEY_DIRECT` — https://resend.com/api-keys
4. **Email для заявок** (опционально, по умолчанию `lanastonevrn@gmail.com`).
5. **GitHub-репозиторий** с этим кодом (или ZIP-загрузка в Timeweb).

---

## 3. Создание приложения в Timeweb

1. **Cloud → Apps → Создать приложение → Docker**.
2. **Источник:** свой GitHub-репозиторий (рекомендуется) либо архив.
3. **Branch:** `main`.
4. **Dockerfile path:** `Dockerfile` (в корне репозитория).
5. **Build context:** `.` (корень).
6. **Внутренний порт контейнера:** `3000`.
7. **Healthcheck path:** `/api/public/health` (HTTP GET, ожидаемый код 200).
8. **Region:** Москва или Санкт-Петербург (для 152-ФЗ).

---

## 4. Переменные окружения (Environment)

Добавьте в разделе "Environment" приложения:

| Переменная | Обязательная | Назначение |
|---|---|---|
| `OPENROUTER_API_KEY` | да | AI-примерка (OpenRouter, Gemini image) |
| `RESEND_API_KEY_DIRECT` | да | Email через Resend |
| `ADMIN_EMAIL` | нет | Куда приходят заявки и заказы. По умолчанию `lanastonevrn@gmail.com` |
| `HOST` | нет | По умолчанию `0.0.0.0` (задано в Dockerfile) |
| `PORT` | нет | По умолчанию `3000` (задано в Dockerfile) |
| `NODE_ENV` | нет | По умолчанию `production` (задано в Dockerfile) |

Все секреты добавляйте **через UI Timeweb**, а не файлом `.env` в репозиторий. Файл `.env` исключён из git (`.gitignore`) и из Docker-контекста (`.dockerignore`).

---

## 5. Деплой

После сохранения настроек Timeweb автоматически:

1. Клонирует репозиторий.
2. Запускает `docker build` по `Dockerfile`. Сборка занимает ~3–5 минут на первом деплое (кэш слоёв ускоряет последующие).
3. Запускает контейнер, передаёт переменные окружения.
4. Делает healthcheck `GET /api/public/health`, ждёт `200 OK`.
5. Подключает HTTPS-домен и выпускает SSL.

---

## 6. Проверка после деплоя

```bash
# Healthcheck
curl -i https://<your-domain>/api/public/health
# → HTTP/2 200, тело "ok"

# Главная страница (SSR)
curl -s https://<your-domain>/ | head -c 200
# → должно начинаться с <!DOCTYPE html>...

# Лид-форма (валидация — должна вернуть 400)
curl -i -X POST https://<your-domain>/api/public/lead \
  -H 'content-type: application/json' \
  -d '{"bad":"payload"}'
# → HTTP/2 400 с {"error":"..."}
```

В браузере проверьте:
- Главная страница открывается, фото и шрифты загружаются.
- Кнопка "Оставить заявку" — заполните форму, отправьте — на `ADMIN_EMAIL` приходит письмо.
- AI-примерка: загрузите фото, выберите украшение, нажмите "Примерить" — через 5–30 секунд возвращается результат.

---

## 7. Обновление сайта

Если репозиторий подключён через GitHub — Timeweb автоматически пересобирает контейнер при пуше в `main`. Иначе нажмите "Redeploy" в UI приложения.

---

## 8. Логи и отладка

- **Cloud → Apps → Lana Stone → Логи** — stdout/stderr контейнера.
- Если healthcheck не проходит — посмотрите логи запуска и убедитесь, что внутренний порт в настройках = `3000` (и НЕ переопределён переменной `PORT`).
- Если AI-примерка возвращает "Сервис временно недоступен" — проверьте баланс OpenRouter.
- Если письма не приходят — проверьте, что `RESEND_API_KEY_DIRECT` валиден и что отправитель `onboarding@resend.dev` не заблокирован (для production желательно подключить свой домен в Resend).

---

## 9. Локальная проверка перед пушем (опционально)

```bash
npm install --legacy-peer-deps
npm run build
HOST=0.0.0.0 PORT=3000 \
OPENROUTER_API_KEY=... \
RESEND_API_KEY_DIRECT=... \
ADMIN_EMAIL=test@example.com \
npm start
# открыть http://localhost:3000
```

Или через Docker:
```bash
docker build -t lanastone .
docker run --rm -p 3000:3000 \
  -e OPENROUTER_API_KEY=... \
  -e RESEND_API_KEY_DIRECT=... \
  lanastone
```

---

## 10. Что НЕ делать

- ❌ Не коммитить `.env` (он в `.gitignore`).
- ❌ Не публиковать `OPENROUTER_API_KEY` и `RESEND_API_KEY_DIRECT` в коде — только через переменные окружения Timeweb.
- ❌ Не менять внутренний порт контейнера на нестандартный — оставляйте `3000`, если нужен другой — задайте через `PORT` в env, и обновите `EXPOSE` в Dockerfile.
- ❌ Не добавлять Supabase/PostgreSQL — БД не используется.
- ❌ Не устанавливать Nginx/PM2 внутри контейнера — Node слушает напрямую, Timeweb сам проксирует HTTPS.
