# 灵智云 AI SaaS

一套可二次开发的 AI 聚合平台前端与服务端代理项目。项目使用 Next.js 16、React 19 和 TypeScript 开发，通过 OpenAI 兼容接口连接 [New API](https://github.com/QuantumNous/new-api)，不包含 SourceGuardian 或其他加密 PHP 文件。

## 当前包含

- 深色星环风格首页和完整移动端适配
- 大模型、智能体、灵感广场、作品与生成记录
- 对话、图片、视频、音频工作台界面
- 高级参数、长期记忆、技能广场和资产库界面
- 账户、充值、账单、团队账号和 API 密钥界面
- SaaS 运营后台：用户、租户、模型、订单、财务、任务、内容、工单、角色和系统配置
- 四套 UI 主题：星环深海、极光幻境、云端简白、曜石金
- `/api/models` 与 `/api/chat` 服务端代理，可对接 New API
- Docker、Linux、Windows 和 Cloudflare/Sites 部署基础

> 当前仓库是可运行、可二开的商业化界面与 New API 接入骨架。未配置 New API 时自动返回演示数据。真实登录注册、支付回调、余额扣费、租户隔离、记忆持久化和图片/视频任务回调，需要继续接入相应后端服务，不能仅靠前端页面实现。

## 技术栈

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS 4 / Lucide Icons
- Vinext / Vite（Cloudflare Worker 构建）
- Drizzle ORM（预留 D1 数据库能力）
- New API（OpenAI 兼容模型网关）

## 快速启动

环境要求：Node.js 22.13 及以上、pnpm 11。

```bash
git clone https://github.com/1468848161/AI.git
cd AI
cp .env.example .env.local
pnpm install --frozen-lockfile
pnpm dev
```

Windows PowerShell：

```powershell
git clone https://github.com/1468848161/AI.git
cd AI
Copy-Item .env.example .env.local
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
pnpm dev
```

打开 `http://localhost:3000`。

## 接入 New API

编辑 `.env.local` 或生产环境的 `.env.production`：

```env
NEW_API_BASE_URL=https://api.example.com
NEW_API_ADMIN_TOKEN=sk-your-server-token
```

- `NEW_API_BASE_URL` 不要以 `/` 结尾。
- `NEW_API_ADMIN_TOKEN` 只允许保存在服务端环境变量中，不能增加 `NEXT_PUBLIC_` 前缀。
- 如果客户端请求携带 Bearer Token，代理会优先使用客户端 Token；否则使用服务端管理 Token。
- 未配置 `NEW_API_BASE_URL` 时，接口会进入演示模式，便于先预览 UI。

## 构建与运行

标准 Node.js 部署：

```bash
pnpm build
pnpm start
```

Docker 部署：

```bash
cp .env.example .env.production
docker compose up -d --build
```

完整的服务器、Nginx、HTTPS、升级和回滚步骤见 [部署手册](docs/DEPLOYMENT.md)。

## 常用命令

| 命令 | 用途 |
|---|---|
| `pnpm dev` | 启动标准 Next.js 开发环境 |
| `pnpm build` | 生成标准 Node.js 独立部署包 |
| `pnpm start` | 启动已构建的独立服务 |
| `pnpm lint` | 执行代码规范检查 |
| `pnpm dev:sites` | 启动 Vinext/Sites 开发环境 |
| `pnpm build:sites` | 生成 Cloudflare Worker 构建 |
| `pnpm db:generate` | 根据 Drizzle Schema 生成迁移 |

## 目录说明

```text
app/                  页面、样式和 API 路由
components/ui/        通用 UI 组件
lib/new-api.ts        New API 服务端请求封装
db/                   Drizzle 数据库接入骨架
docs/DEPLOYMENT.md    完整部署手册
public/               静态资源
Dockerfile            生产镜像构建
docker-compose.yml    单机部署编排
```

## 安全约定

- 仓库只提交 `.env.example`，真实 `.env` 文件已被 Git 忽略。
- 不要把数据库密码、支付密钥、New API Token 或第三方密钥写入代码。
- 生产环境应通过防火墙只开放 80/443，应用端口仅监听 `127.0.0.1`。
- 支付回调必须在服务端验签，并使用数据库唯一约束保证幂等。
- 正式商用前应补充鉴权、权限校验、限流、日志脱敏、备份和安全审计。

## 主题切换

进入运营后台的“界面装修”，可切换四套主题。当前选择保存在浏览器本地存储；如需对所有租户统一生效，可把主题设置保存到租户配置表并由服务端下发。
