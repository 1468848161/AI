# 灵智云 AI SaaS 一体化版

可二次开发的 AI 聚合 SaaS。仓库已经把用户前端、运营后台、[New API](https://github.com/QuantumNous/new-api)、PostgreSQL 和 Redis 组合成一套 Docker Compose 服务，无需再单独安装数据库或网关。

## 一条命令部署

Linux：

```bash
git clone https://github.com/1468848161/AI.git
cd AI
bash scripts/deploy.sh
```

Windows（已安装 Docker Desktop）：

```powershell
git clone https://github.com/1468848161/AI.git
cd AI
powershell -ExecutionPolicy Bypass -File .\scripts\deploy.ps1
```

部署脚本会：

1. 从 `.env.example` 创建不提交到 Git 的 `.env`；
2. 随机生成 PostgreSQL、Redis、会话签名和灵感商城管理密钥；
3. 启动 PostgreSQL、Redis、New API 和 AI SaaS 前端；
4. 等待依赖健康后再启动上层服务；
5. 将前端和 New API 分别绑定到本机 3000、3001 端口。

## 服务组成

| 服务 | 容器内职责 | 默认宿主机地址 |
|---|---|---|
| `ai-saas` | 用户端、运营后台、灵感商城与 New API 服务端代理 | `127.0.0.1:3000` |
| `new-api` | 模型渠道、令牌、额度、计费和调用日志 | `127.0.0.1:3001` |
| `postgres` | New API 主数据库 | 不暴露 |
| `redis` | 会话、缓存和限流 | 不暴露 |

前端通过 Docker 内网地址 `http://new-api:3000` 调用 New API，管理 Token 只存在于服务端环境变量，不会发送到浏览器。

灵感商城使用 `ai_saas_data` 持久化卷保存售价、购买授权、订单、余额与资金流水。购买接口在服务端事务中校验实时售价并原子扣款，已购模板可重复使用且不会再次扣费。

## 首次初始化

启动后访问 New API 管理端，完成首次管理员初始化、添加模型渠道并创建一个前端专用令牌。

编辑自动生成的 `.env`：

```env
NEW_API_ADMIN_TOKEN=sk-你的前端专用令牌
```

然后只重启前端：

```bash
docker compose --env-file .env up -d --force-recreate ai-saas
```

远程服务器默认不公开 3000/3001 端口，可使用 SSH 隧道初始化：

```bash
ssh -L 3000:127.0.0.1:3000 -L 3001:127.0.0.1:3001 user@server-ip
```

浏览器访问 `http://127.0.0.1:3001`。正式上线请为前端和 New API 分别配置 HTTPS 域名，详见 [完整部署手册](docs/DEPLOYMENT.md)。

## 当前功能

- 参考目标站公开页面信息架构重做的深色星空首页：双层模型环、智能体、能力区与瀑布流灵感广场
- 窄栏大模型工作台、模型/厂商筛选、收藏置顶、历史会话与生成记录
- 30+ 模型展示目录、40 个可筛选智能体、18 个可收藏/购买/复用的灵感模板
- 灵感同款商城：免费与付费模板、余额购买、永久授权、防重复扣款、购买订单和私有提示词解锁
- 对话、图片、视频、音频工作台界面
- 对话工作台真实调用内置 New API 的 `/v1/chat/completions`
- 高级设置、长期记忆、技能广场和资产库
- 账户、充值、账单、团队账号和 API 密钥界面
- SaaS 运营后台：租户、用户、模型、灵感商品定价/上下架、订单、财务、任务、内容、工单、角色和系统配置
- 星环深海、极光幻境、云端简白、曜石金四套 UI，可在个人中心或后台切换
- 独立浅色开放平台：首页、模型市场、价格筛选、综合排行、交互式 API 文档和接入指引
- 关于我们、隐私政策、用户协议等公开页面
- New API 模型网关、渠道、令牌、额度与日志管理
- PostgreSQL、SQLite 持久化、Redis 缓存、健康检查、双数据库备份和升级脚本

> 图片、视频、音频的界面与参数已经提供；真实生成需先在 New API 配置相应渠道或任务插件，再接入对应媒体端点。平台账户、支付回调和租户账务仍需根据实际支付商户及业务规则继续开发，不能仅靠 New API 自动完成。

## 页面路由

| 路径 | 页面 |
|---|---|
| `/` | 品牌首页、能力介绍、智能体与灵感作品 |
| `/home` | 多模型创作工作台 |
| `/api` | API 开放平台首页 |
| `/api/pricing` | 模型市场与价格筛选 |
| `/api/rankings` | 模型综合排行 |
| `/apidoc` | 交互式 API 接入文档 |
| `/account` | 用户中心、充值、账单、密钥、团队与工单 |
| `/admin` | 多租户 SaaS 运营管理后台 |
| `/about`、`/privacy`、`/terms` | 关于与法律页面 |

## 常用运维命令

```bash
# 状态
docker compose --env-file .env ps

# 日志
docker compose --env-file .env logs -f --tail=200

# 同时备份 New API 与灵感商城数据库
bash scripts/backup-stack.sh

# 更新前端与基础服务镜像
bash scripts/update-stack.sh

# 停止但保留数据
docker compose --env-file .env down
```

不要执行 `docker compose down -v`，该命令会删除数据库和缓存卷。

## 本地二次开发

要求 Node.js 22.13+、pnpm 11：

```bash
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

只开发前端时，将 `.env.local` 中配置为可访问的 New API：

```env
NEW_API_BASE_URL=http://127.0.0.1:3001
NEW_API_ADMIN_TOKEN=sk-your-token
```

## 构建命令

| 命令 | 用途 |
|---|---|
| `pnpm dev` | Next.js 开发环境 |
| `pnpm build` | Node.js standalone 生产构建 |
| `pnpm start` | 启动 standalone 构建 |
| `pnpm lint` | 代码规范检查 |
| `pnpm build:sites` | Cloudflare/Sites 构建 |

## 目录

```text
app/                       页面、后台和 API 路由
components/ui/             通用 UI 组件
lib/new-api.ts             New API 服务端请求封装
lib/inspiration-commerce.ts 灵感商品、余额与订单事务
deploy/                    Nginx 配置模板
docs/DEPLOYMENT.md         一体化部署与运维手册
scripts/deploy.sh          Linux 一键部署
scripts/deploy.ps1         Windows 一键部署
scripts/backup-stack.sh    PostgreSQL 与灵感商城备份
scripts/update-stack.sh    整体升级
docker-compose.yml         四服务一体化编排
```

## 安全说明

- 真实 `.env`、备份和运行数据均被 Git 忽略。
- 数据库与 Redis 不映射到宿主机公网端口。
- 前端和 New API 默认仅监听 `127.0.0.1`。
- 正式环境必须启用 HTTPS，并为 New API 配置 Secure Cookie 和可信 Origin。
- `SAAS_ADMIN_KEY` 只用于后台修改灵感商品，请勿写入前端代码或提交 Git。
- 不要把数据库密码、New API Token、支付密钥或模型渠道密钥提交到仓库。
- New API 默认使用官方 `latest` 镜像；商业生产建议先测试，然后在 `.env` 固定经过验证的版本标签。
- New API 使用 AGPL-3.0，商业部署前请阅读 [第三方组件声明](THIRD_PARTY_NOTICES.md) 并确认合规方案。
