# ---------- Этап 1: сборка ----------
FROM node:22-alpine AS builder

WORKDIR /app

ENV NITRO_PRESET=node-server

COPY package.json package-lock.json ./

RUN npm ci --include=dev --legacy-peer-deps

COPY . .

ENV NODE_ENV=production

RUN npm run build


# ---------- Этап 2: запуск ----------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NITRO_PRESET=node-server
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=127.0.0.1
ENV NITRO_PORT=3001
ENV INTERNAL_NITRO_PORT=3001

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/start.mjs ./start.mjs

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=3s --start-period=3s --retries=18 \
  CMD node -e "const http=require('node:http');const port=process.env.PORT||3000;const req=http.get({host:'127.0.0.1',port,path:'/api/public/health',timeout:2500},res=>process.exit(res.statusCode>=200&&res.statusCode<300?0:1));req.on('error',()=>process.exit(1));req.on('timeout',()=>{req.destroy();process.exit(1);});"

ENTRYPOINT ["node", "start.mjs"]