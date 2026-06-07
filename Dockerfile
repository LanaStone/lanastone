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
ENV PORT=3000

# Берём только готовую сборку Nitro (содержит пропатченный srvx и router-core)
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# Никакого entrypoint-скрипта — Nitro сам читает PORT/HOST из env
CMD ["node", ".output/server/index.mjs"]
