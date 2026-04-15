# WSOD Droplet Deploy Guide

## 1. Setup server
sudo apt update && sudo apt upgrade -y
sudo apt install -y nodejs npm git nginx

## 2. Clone repo
cd /var/www
git clone https://github.com/dragoshelemenet/wsod.git
cd wsod/wsod-site

## 3. Install deps
npm install

## 4. Setup env
cp .env.example .env
# edit values

## 5. Setup DB folder
mkdir -p /var/www/wsod/shared/data

## 6. Prisma generate
npx prisma generate

## 7. Build app
npm run build

## 8. Install PM2
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

## 9. Nginx (basic)
# proxy to localhost:3000

