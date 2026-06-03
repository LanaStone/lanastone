# ---------- Этап 1: сборка ----------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* bun.lockb* ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build


# ---------- Этап 2: рантайм ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY package.json package-lock.json* ./

RUN npm install --omit=dev --legacy-peer-deps

COPY --from=builder /app/.output ./.output
COPY server.mjs ./server.mjs

EXPOSE 3000

CMD ["node", "server.mjs"]