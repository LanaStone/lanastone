# ---------- Этап 1: сборка фронтенда ----------
FROM node:22-alpine AS builder

WORKDIR /app

ENV NITRO_PRESET=node-server

COPY package.json package-lock.json ./

RUN npm ci --include=dev --legacy-peer-deps

COPY . .

ENV NODE_ENV=production

RUN npm run build


# ---------- Этап 2: стабильный запуск для Timeweb ----------
FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache nginx

ENV NODE_ENV=production
ENV APP_HOST=127.0.0.1
ENV APP_PORT=3001
ENV APP_ROOT=/app
ENV APP_PUBLIC_DIR=/app/public

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/start.mjs ./server.mjs
COPY --from=builder /app/package.json ./package.json
RUN mkdir -p /app/public /app/.output/server \
  && if [ -d /app/.output/public ]; then cp -a /app/.output/public/. /app/public/; fi \
  && if [ ! -f /app/public/index.html ]; then printf '<!doctype html><html><body>Lana Stone is starting</body></html>' > /app/public/index.html; fi \
  && cp /app/server.mjs /app/.output/server/index.mjs
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh && mkdir -p /run/nginx /var/cache/nginx

EXPOSE 3000

HEALTHCHECK --interval=2s --timeout=2s --start-period=0s --retries=60 \
  CMD node -e "const http=require('node:http');const req=http.get({host:'127.0.0.1',port:3000,path:'/health',timeout:1500},res=>process.exit(res.statusCode>=200&&res.statusCode<300?0:1));req.on('error',()=>process.exit(1));req.on('timeout',()=>{req.destroy();process.exit(1);});"

ENTRYPOINT ["/app/docker-entrypoint.sh"]