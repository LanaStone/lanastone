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

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "const port = process.env.PORT || '3000'; fetch('http://127.0.0.1:' + port + '/api/public/health').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "server.mjs"]
