Проблема уже понятна: текущая сборка проекта сделана под serverless/Worker-окружение, поэтому `dist/server/server.js` экспортирует обработчик `fetch`, но не поднимает HTTP-порт. PM2 запускает файл, процесс «живой», но слушать `:3000` там нечему.

План исправления:

1. Изменить конфиг сборки для VPS/PM2
   - Оставить Lovable/Vite-конфиг для разработки.
   - Отключить Cloudflare/Worker-адаптер для production-сборки на вашем сервере.
   - Добавить Node/Nitro-адаптер, чтобы после `npm run build` появлялся запускной файл `.output/server/index.mjs`.

2. Добавить правильные npm-скрипты
   - `build`: собирает приложение.
   - `start`: запускает `node .output/server/index.mjs`.
   - PM2 должен запускать именно `npm start` или `.output/server/index.mjs`, а не `dist/server/server.js`.

3. После внесения изменений на сервере выполнить один чистый сценарий

```bash
cd /var/www/lanastone
npm install
npm run build
pm2 delete lanastone || true
PORT=3000 HOST=0.0.0.0 pm2 start npm --name lanastone -- start
pm2 save
ss -ltnp | grep ':3000'
curl -I http://127.0.0.1:3000
```

4. Если `ss` покажет `:3000`, дальше проверять только nginx/proxy
   - upstream должен вести на `127.0.0.1:3000`.
   - больше не трогать `dist/server/server.js`, потому что это не Node-сервер.

Технически нужно будет установить Node-адаптер для TanStack Start/Nitro и поправить `vite.config.ts` + `package.json`.