# ---------- Этап 1: сборка ----------
FROM node:22-alpine AS builder

WORKDIR /app

ENV NITRO_PRESET=node-server

COPY package.json package-lock.json ./
RUN npm ci --include=dev --legacy-peer-deps

COPY . .

ENV NODE_ENV=production
RUN npm run build


# ---------- Этап 2: запуск Nitro ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

# Берём только готовую сборку Nitro
COPY --from=builder /app/.output ./.output

EXPOSE 3000

HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=20 \
  CMD node -e "require('node:http').get({host:'127.0.0.1',port:3000,path:'/',timeout:2000},r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
