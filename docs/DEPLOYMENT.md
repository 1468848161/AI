# 灵智云 AI SaaS 部署手册

本文提供推荐的 Docker 部署方式，以及 Node.js、Windows 和 Cloudflare Worker 部署方法。生产环境建议使用独立域名，并让 Nginx 负责 HTTPS。

## 1. 部署前准备

推荐配置：

- Ubuntu 22.04/24.04，2 核 CPU、4 GB 内存及以上
- Docker Engine 24+ 和 Docker Compose v2
- 已解析到服务器的域名
- 可访问的 New API 地址及服务端 Token

安全组只开放：

- `22/tcp`：SSH，建议限制来源 IP
- `80/tcp`：HTTP
- `443/tcp`：HTTPS

不要把应用端口 3000、数据库端口或 New API 管理端口直接暴露到公网。

## 2. Docker 部署（推荐）

### 2.1 安装 Docker

Ubuntu：

```bash
curl -fsSL https://get.docker.com | sh
sudo systemctl enable --now docker
sudo usermod -aG docker "$USER"
```

重新登录 SSH 后确认：

```bash
docker version
docker compose version
```

### 2.2 获取源码

```bash
git clone https://github.com/1468848161/AI.git
cd AI
```

### 2.3 配置环境变量

```bash
cp .env.example .env.production
nano .env.production
```

至少填写：

```env
NEW_API_BASE_URL=https://你的-new-api-域名
NEW_API_ADMIN_TOKEN=你的服务端Token
```

保存后限制读取权限：

```bash
chmod 600 .env.production
```

### 2.4 构建并启动

```bash
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 ai-saas
```

本机检查：

```bash
curl -I http://127.0.0.1:3000
```

## 3. 配置 Nginx 与 HTTPS

安装 Nginx：

```bash
sudo apt update
sudo apt install -y nginx
```

创建 `/etc/nginx/sites-available/ai-saas`：

```nginx
server {
    listen 80;
    server_name ai.example.com;

    client_max_body_size 100m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
}
```

将 `ai.example.com` 替换成真实域名，然后执行：

```bash
sudo ln -s /etc/nginx/sites-available/ai-saas /etc/nginx/sites-enabled/ai-saas
sudo nginx -t
sudo systemctl reload nginx
```

申请 HTTPS 证书：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ai.example.com
sudo certbot renew --dry-run
```

## 4. 更新版本

```bash
cd AI
git pull --ff-only
docker compose build --pull
docker compose up -d
docker image prune -f
```

查看运行状态：

```bash
docker compose ps
docker compose logs -f --tail=200 ai-saas
```

## 5. 回滚

先查看提交：

```bash
git log --oneline -10
```

选择需要恢复的版本并新建回滚分支，避免破坏历史：

```bash
git switch -c rollback-YYYYMMDD <commit_sha>
docker compose up -d --build
```

确认无误后，再决定是否将回滚提交合并到主分支。

## 6. 不使用 Docker 的 Node.js 部署

```bash
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env.production
pnpm build
PORT=3000 HOSTNAME=127.0.0.1 pnpm start
```

生产环境建议使用 systemd 或其他进程管理器守护服务，不要使用开发命令 `pnpm dev`。

示例 `/etc/systemd/system/ai-saas.service`：

```ini
[Unit]
Description=Lingzhi AI SaaS
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/AI
EnvironmentFile=/opt/AI/.env.production
Environment=PORT=3000
Environment=HOSTNAME=127.0.0.1
ExecStart=/usr/bin/node /opt/AI/.next/standalone/server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

## 7. Windows 本地或内网部署

安装 Node.js 22 LTS 和 Git，然后在 PowerShell 中执行：

```powershell
git clone https://github.com/1468848161/AI.git
cd AI
Copy-Item .env.example .env.production
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
pnpm build
$env:PORT="3000"
$env:HOSTNAME="0.0.0.0"
pnpm start
```

同一局域网设备可通过 `http://服务器局域网IP:3000` 访问。公网部署仍建议使用 Linux、Nginx 和 HTTPS。

## 8. Cloudflare Worker / Sites 构建

项目保留了 Vinext 构建链：

```bash
pnpm build:sites
```

构建结果位于 `dist/`。部署到 Cloudflare 时，需要在运行环境中配置 `NEW_API_BASE_URL` 和 `NEW_API_ADMIN_TOKEN`，不要把真实值写进仓库。

## 9. 上线检查清单

- [ ] New API 地址使用 HTTPS
- [ ] Token 仅存在于服务端环境变量
- [ ] `.env.production` 未被 Git 跟踪
- [ ] 服务器只开放 22/80/443
- [ ] Nginx 与 HTTPS 配置有效
- [ ] 真实登录、租户隔离和后台权限已启用
- [ ] 支付回调完成签名校验和幂等处理
- [ ] 数据库和上传文件有定时备份
- [ ] 日志不记录 Token、密码和完整个人信息
- [ ] 已设置监控、告警和资源限额

## 10. 常见问题

### 页面提示演示模式

服务端没有读取到 `NEW_API_BASE_URL`。检查 `.env.production` 后重启容器：

```bash
docker compose up -d --force-recreate
```
### New API 返回 401

检查 `NEW_API_ADMIN_TOKEN` 是否有效，以及对应渠道、模型和额度是否可用。

### Nginx 返回 502

先检查应用：

```bash
docker compose ps
docker compose logs --tail=200 ai-saas
curl -I http://127.0.0.1:3000
```

### 修改环境变量后没有生效

重新创建容器：

```bash
docker compose up -d --force-recreate
```
