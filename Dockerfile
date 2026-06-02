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

# Копируем только готовую сборку и манифест зависимостей
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
