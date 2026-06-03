# Развёртывание Lana Stone на Timeweb Cloud

Эта инструкция описывает перенос сайта с Lovable на собственный VPS Timeweb с доменом и SSL. Все шаги выполняются по SSH на сервере.

> Сайт не использует базу данных, авторизацию и файловое хранилище. Только лид-форма (email) и AI-примерка (OpenRouter). Это сильно упрощает деплой.

---

## 1. Что нужно подготовить заранее

1. **VPS в Timeweb Cloud**
   - Раздел: **Cloud → Серверы → Создать сервер**
   - Тариф: 2 vCPU / 2 ГБ RAM / 30 ГБ NVMe (от 300 ₽/мес)
   - ОС: **Ubuntu 22.04 LTS**
   - Локация: **Москва** или **Санкт-Петербург** (для 152-ФЗ)
   - После создания записать **IP-адрес сервера**, **root-пароль** (или SSH-ключ)

2. **Домен** (например `lanastone.ru`)
   - Купить можно у reg.ru или прямо в Timeweb
   - В панели управления доменом создать **A-запись**: `@` → IP сервера
   - И ещё одну для `www`: `www` → тот же IP
   - DNS обновляется до 1–2 часов

3. **Ключи**
   - `OPENROUTER_API_KEY` — на https://openrouter.ai/keys (пополнить баланс хотя бы на $5)
   - `RESEND_API_KEY_DIRECT` — на https://resend.com/api-keys

4. **Код проекта**
   - В Lovable: **GitHub → Connect → Create Repository** (экспортировать в свой репозиторий)
   - Или скачать ZIP и залить на сервер вручную

---

## 2. Первичная настройка сервера

Подключиться по SSH:
```bash
ssh root@IP_СЕРВЕРА
```

Обновить систему и поставить базовые пакеты:
```bash
apt update && apt upgrade -y
apt install -y curl git nginx ufw
```

Настроить firewall:
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

Установить Node.js 22:
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node -v  # должно показать v22.x.x
```

Установить pm2 (менеджер процессов):
```bash
npm install -g pm2
```

---

## 3. Node.js-сборка для Timeweb

В проекте уже настроен Docker/Node-запуск для Timeweb:

- `vite.config.ts` отключает hosted-адаптер и собирает Node-сервер через Nitro;
- сервер запускается через `node .output/server/index.mjs`: после сборки этот файл принудительно заменяется на встроенный Node-шлюз, который слушает `0.0.0.0:3000`, сразу отвечает на healthcheck Timeweb и обслуживает собранный сайт;
- `Dockerfile` открывает порт `3000`, проверяет корневой путь `/` и содержит `CMD ["node", ".output/server/index.mjs"]`, поэтому контейнер сам знает, что запускать даже без поля **«Команда запуска»**.

Если Timeweb всё же покажет поле **«Команда запуска»**, оставьте его пустым. Если поле обязательно — укажите:
```bash
node .output/server/index.mjs
```

Актуальная конфигурация `vite.config.ts`:

```ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitroV2Plugin } from "@tanstack/nitro-v2-vite-plugin";

export default defineConfig({
  nitro: false,
  plugins: [nitroV2Plugin({ preset: "node-server" })],
});
```

### 3.1 Собрать локально для проверки
```bash
npm ci --include=dev --legacy-peer-deps
npm run build
npm run start
# открыть http://localhost:3000
```

Если всё работает — закоммитить и запушить в GitHub.

---

## 4. Деплой на сервер

На сервере:
```bash
cd /var/www
git clone https://github.com/USER/lanastone.git
cd lanastone
npm ci --include=dev --legacy-peer-deps
npm run build
```

Создать файл `.env` (см. `.env.example`):
```bash
nano .env
# вставить:
# OPENROUTER_API_KEY=sk-or-v1-...
# RESEND_API_KEY_DIRECT=re_...
# APP_PORT=3000  # необязательно, по умолчанию уже 3000
```

Запустить через pm2:
```bash
set -a
. ./.env
set +a
pm2 start npm --name lanastone -- start
pm2 save
pm2 startup   # выполнить команду, которую он выведет
```

Проверить:
```bash
curl http://localhost:3000
```

---

## 5. Nginx + домен + SSL

Создать конфиг Nginx:
```bash
nano /etc/nginx/sites-available/lanastone
```

Вставить:
```nginx
server {
    listen 80;
    server_name lanastone.ru www.lanastone.ru;

    client_max_body_size 20M;  # для загрузки фото в AI-примерку

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;  # AI-примерка может занимать до минуты
    }
}
```

Активировать:
```bash
ln -s /etc/nginx/sites-available/lanastone /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Получить SSL-сертификат Let's Encrypt:
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d lanastone.ru -d www.lanastone.ru
# выбрать "redirect" — автоматический редирект с HTTP на HTTPS
```

Сертификат обновляется автоматически. Проверить:
```bash
certbot renew --dry-run
```

---

## 6. Обновление сайта (потом)

Когда нужно выкатить изменения:
```bash
cd /var/www/lanastone
git pull
npm ci --include=dev --legacy-peer-deps
npm run build
pm2 restart lanastone
```

---

## 7. Полезные команды

```bash
pm2 logs lanastone        # смотреть логи
pm2 restart lanastone     # перезапустить
pm2 status                # статус процессов
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## 8. Что НЕ нужно делать

- НЕ ставить Supabase, PostgreSQL, Redis — БД не используется
- НЕ настраивать SMTP — письма уходят через Resend по HTTPS
- НЕ выставлять порт 3000 наружу — он только для Nginx (firewall его блокирует)

---

## 9. Если что-то пошло не так

| Проблема | Что проверить |
|---|---|
| Сайт не открывается | `pm2 status`, `pm2 logs lanastone`, DNS прописан? |
| 502 Bad Gateway | Node-процесс упал — `pm2 logs` покажет причину |
| AI-примерка не работает | `OPENROUTER_API_KEY` в `.env`, баланс пополнен? |
| Письма не приходят | `RESEND_API_KEY_DIRECT` в `.env`, проверить spam |
| SSL не работает | `certbot certificates`, домен указывает на сервер? |

---

Готово. После всех шагов сайт работает на `https://lanastone.ru` полностью на российских серверах.
