# syntax=docker/dockerfile:1.7
# ============================================================
#   Lana Stone — Production Dockerfile для Timeweb Cloud
# ============================================================
# Двух-этапная сборка:
#   1) builder — ставит зависимости, собирает Nitro-сервер,
#      применяет постбилд-патчи (scripts/patch-srvx.mjs).
#   2) runner  — минимальный образ только с .output/.
# ============================================================

# ---------- Этап 1: сборка ----------
FROM node:22-alpine AS builder

WORKDIR /app

ENV NITRO_PRESET=node-server

# Сначала только манифесты — для кэширования npm-слоя
COPY package.json package-lock.json* ./
RUN npm install --include=dev --legacy-peer-deps

# Затем остальной код и сборка
COPY . .
ENV NODE_ENV=production
RUN npm run build


# ---------- Этап 2: запуск Nitro ----------
FROM node:22-alpine AS runner

WORKDIR /app

# Сетевые настройки — Timeweb пробрасывает свой PORT через env.
# HOST=0.0.0.0 обязателен, иначе сервер не виден снаружи контейнера.
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=8080

COPY --from=builder /app/.output ./.output

EXPOSE 8080

CMD ["sh", "-c", "echo START HOST=$HOST PORT=$PORT NITRO_HOST=$NITRO_HOST NITRO_PORT=$NITRO_PORT; node .output/server/index.mjs & sleep 8; echo LOCAL_CHECK_START; wget -S -O - http://127.0.0.1:${PORT}/api/public/health || true; echo LOCAL_CHECK_ROOT; wget -S -O - http://127.0.0.1:${PORT}/ || true; echo LOCAL_CHECK_END; wait"]
