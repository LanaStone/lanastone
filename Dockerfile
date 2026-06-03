# ---------- Этап 1: сборка ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Сначала только package.json — чтобы кеш слоёв работал
COPY package.json package-lock.json* bun.lockb* ./

# Ставим зависимости (включая dev — нужны для сборки)
RUN npm install --legacy-peer-deps

# Копируем весь проект
COPY . .

# Собираем TanStack Start (Nitro emits .output/server/index.mjs)
RUN npm run build


# ---------- Этап 2: рантайм ----------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Ставим production-зависимости: Nitro-сервер может оставлять часть пакетов внешними.
COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps

# Копируем готовую сборку и Node-wrapper, который жёстко задаёт host/port для Timeweb.
COPY --from=builder /app/.output ./.output
COPY server.mjs ./server.mjs

EXPOSE 3000


CMD ["node", "server.mjs"]
