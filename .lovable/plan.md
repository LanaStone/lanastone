Проблема уже понятна: текущая сборка проекта сделана под serverless/Worker-окружение, поэтому `dist/server/server.js` экспортирует обработчик `fetch`, но не поднимает HTTP-порт. PM2 запускает файл, процесс «живой», но слушать `:3000` там нечему.

План исправления:

1. Изменить конфиг сборки для VPS/PM2
   - Оставить Lovable/Vite-конфиг для разработки.
   - Отключить Cloudflare/Worker-адаптер для production-сборки на вашем сервере.
   - Добавить Node/Nitro-адаптер, чтобы после `npm run build` появлялся запускной файл `.output/server/index.mjs`.
   - Запускать его через `start.sh`, который сам выставляет `HOST=0.0.0.0`, `PORT=3000`, `NITRO_HOST` и `NITRO_PORT`.

2. Добавить правильные npm-скрипты
   - `build`: собирает приложение.
   - `start`: запускает `sh start.sh`.
   - Dockerfile должен содержать `ENTRYPOINT ["sh", "start.sh"]`, чтобы Timeweb не зависел от внешнего поля «Команда запуска».
   - PM2 должен запускать именно `npm start`, а не `dist/server/server.js`.

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