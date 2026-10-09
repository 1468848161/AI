import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { inspirationItems } from "@/components/platform/data";

type CatalogRow = {
  id: string;
  price_cents: number;
  enabled: number;
  sales: number;
  purchased: number;
};

type UserRow = { balance_cents: number };
type PurchaseRow = { id: string; order_no: string; amount_cents: number; created_at: string };
type OrderRow = PurchaseRow & { product_id: string; title: string; status: string };

export class CommerceError extends Error {
  constructor(message: string, public readonly status: number, public readonly code: string) {
    super(message);
  }
}

const prompts: Record<string, string> = {
  "aurora-silver-fashion": "以银白未来时尚为核心，创作一张高端人物大片：冷调极光背景、液态金属服饰、清晰面部细节、柔和轮廓光、电影级景深，保留高级杂志留白。主体与场景需求：",
  "aurora-tech-product": "创作极光科技产品广告：透明玻璃与金属产品居中，青蓝渐变极光从后方掠过，使用轮廓光、折射、高级暗场与商业级微距质感。产品信息：",
  "cloud-future-city": "设计云海之上的未来城市，包含流线型白色建筑、空中交通与晨曦体积光，广角电影构图，兼顾宏大尺度和真实建筑细节。补充要求：",
  "wilderness-cinematic-portrait": "生成旷野电影感人像：自然逆光、低饱和大地色、真实皮肤纹理、风吹发丝、35mm 胶片颗粒与横向叙事构图。人物设定：",
  "retro-magazine-cover": "设计复古时尚杂志封面，使用胶片人像、衬线标题、红棕与米白配色、精细网格排版，并预留期号、条码和副标题区域。主题：",
  "ink-landscape-animation": "制作水墨山河短片方案：宣纸纹理、墨色晕染、云雾分层、飞鸟与舟行，镜头由近景松枝缓慢推进至远山，节奏舒缓并保持东方留白。内容：",
  "glass-skincare-product": "制作透明玻璃护肤品电商主图：干净浅色背景、水波纹与玻璃折射、柔和棚拍光、标签文字清晰、产品边缘锐利，适合高端详情页。产品：",
  "miniature-forest-world": "创作森林微缩世界：苔藓、蘑菇小屋、暖色窗光与薄雾，微距移轴效果，细节丰富但画面治愈克制。故事主题：",
  "purple-night-portrait": "生成紫夜都市霓虹肖像：紫蓝灯牌反射、潮流服饰、湿润街面、真实肤质与浅景深，构图适合社交媒体封面。人物：",
  "summit-space-station": "设计山巅空间站概念图：建筑悬于云海与岩壁之间，冷白结构搭配暖色窗光，航拍广角、真实大气透视与电影级尺度。用途：",
  "new-chinese-tea-package": "完成新中式茶饮品牌包装方案：提炼东方纹样、现代宋体与天然纸张质感，输出主包装正背面、杯身、手提袋及陈列效果。品牌信息：",
  "mechanical-insect-sheet": "制作机械昆虫角色设定集：正侧背三视图、结构爆炸图、材质标注与局部特写，硬表面工业设计语言，统一比例尺。设定：",
  "summer-beach-portrait": "生成夏日海边生活感写真：日落金色逆光、轻微动态抓拍、自然表情、柔和胶片色彩与真实海风氛围。人物和服装：",
  "clay-coffee-shop": "制作黏土风咖啡店定格动画方案：手作材质、小比例角色、暖色灯光、轻微逐帧抖动，包含开门、制作咖啡与递出杯子的镜头。主题：",
  "cyber-mecha-character": "设计赛博机甲角色：完整正侧背设定、武器与关节结构拆解、黑钛与青色能量配色，兼顾可制造逻辑和游戏概念表现。角色定位：",
  "oriental-courtyard": "生成现代东方庭院空间：木、石、水景与借景构图，晨间柔光、克制留白、真实建筑摄影质感，强调动线和尺度。空间需求：",
  "luxury-jewelry-closeup": "制作奢华珠宝商业特写：深色背景、精准高光、宝石火彩与金属微纹理，微距景深和高端品牌广告构图。产品：",
  "fantasy-forest-guardian": "创作奇幻森林守护者角色插画：古老植物铠甲、微光符文、潮湿森林与体积雾，电影级角色海报构图，突出轮廓和叙事感。角色故事：",
};

const globalCommerce = globalThis as typeof globalThis & { __lingzhiCommerceDb?: DatabaseSync };

function databasePath() {
  const configured = process.env.SAAS_DATABASE_PATH || "storage/commerce.sqlite";
  return configured === ":memory:" ? configured : resolve(/*turbopackIgnore: true*/ process.cwd(), configured);
}

function getDatabase() {
  if (globalCommerce.__lingzhiCommerceDb) return globalCommerce.__lingzhiCommerceDb;
  const path = databasePath();
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;");
  db.exec(`
    CREATE TABLE IF NOT EXISTS commerce_users (
      id TEXT PRIMARY KEY,
      display_name TEXT NOT NULL DEFAULT '创作用户',
      balance_cents INTEGER NOT NULL CHECK (balance_cents >= 0),
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS inspiration_products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      creator TEXT NOT NULL,
      media TEXT NOT NULL,
      price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
      enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS inspiration_purchases (
      id TEXT PRIMARY KEY,
      order_no TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL REFERENCES commerce_users(id),
      product_id TEXT NOT NULL REFERENCES inspiration_products(id),
      amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
      status TEXT NOT NULL DEFAULT 'paid',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, product_id)
    );
    CREATE TABLE IF NOT EXISTS wallet_ledger (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES commerce_users(id),
      business_type TEXT NOT NULL,
      amount_cents INTEGER NOT NULL,
      balance_after_cents INTEGER NOT NULL,
      reference_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_inspiration_purchases_user ON inspiration_purchases(user_id, created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_wallet_ledger_user ON wallet_ledger(user_id, created_at DESC);
  `);

  const insert = db.prepare(`
    INSERT INTO inspiration_products (id, title, creator, media, price_cents)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      creator = excluded.creator,
      media = excluded.media
  `);
  for (const item of inspirationItems) insert.run(item[6], item[0], item[9], item[8], item[7]);
  globalCommerce.__lingzhiCommerceDb = db;
  return db;
}

function ensureUser(db: DatabaseSync, viewerId: string) {
  const startingBalance = Math.max(0, Number.parseInt(process.env.SAAS_NEW_USER_BALANCE_CENTS || "12860", 10) || 0);
  db.prepare("INSERT INTO commerce_users (id, balance_cents) VALUES (?, ?) ON CONFLICT(id) DO NOTHING").run(viewerId, startingBalance);
  return db.prepare("SELECT balance_cents FROM commerce_users WHERE id = ?").get(viewerId) as UserRow;
}

function privatePrompt(productId: string) {
  const prompt = prompts[productId];
  if (!prompt) throw new CommerceError("模板内容不存在", 404, "PRODUCT_CONTENT_NOT_FOUND");
  return prompt;
}

export function getInspirationCatalog(viewerId: string) {
  const db = getDatabase();
  const user = ensureUser(db, viewerId);
  const rows = db.prepare(`
    SELECT p.id, p.price_cents, p.enabled,
      (SELECT COUNT(*) FROM inspiration_purchases s WHERE s.product_id = p.id AND s.status = 'paid') AS sales,
      EXISTS(SELECT 1 FROM inspiration_purchases mine WHERE mine.product_id = p.id AND mine.user_id = ? AND mine.status = 'paid') AS purchased
    FROM inspiration_products p
    ORDER BY p.rowid
  `).all(viewerId) as CatalogRow[];
  return {
    balanceCents: user.balance_cents,
    items: rows.map(row => ({
      id: row.id,
      priceCents: row.price_cents,
      enabled: Boolean(row.enabled),
      sales: row.sales,
      purchased: Boolean(row.purchased) || row.price_cents === 0,
    })),
  };
}

function createOrderNumber() {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(2, 14);
  return `INS-${stamp}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

export function purchaseInspiration(viewerId: string, productId: string, expectedPriceCents: number) {
  const db = getDatabase();
  ensureUser(db, viewerId);
  db.exec("BEGIN IMMEDIATE");
  try {
    const product = db.prepare("SELECT id, price_cents, enabled FROM inspiration_products WHERE id = ?").get(productId) as Pick<CatalogRow, "id" | "price_cents" | "enabled"> | undefined;
    if (!product) throw new CommerceError("该灵感模板不存在", 404, "PRODUCT_UNAVAILABLE");
    const prompt = privatePrompt(productId);

    const owned = db.prepare("SELECT id, order_no, amount_cents, created_at FROM inspiration_purchases WHERE user_id = ? AND product_id = ? AND status = 'paid'").get(viewerId, productId) as PurchaseRow | undefined;
    const currentUser = db.prepare("SELECT balance_cents FROM commerce_users WHERE id = ?").get(viewerId) as UserRow;
    if (owned) {
      db.exec("COMMIT");
      return { orderNo: owned.order_no, amountCents: owned.amount_cents, balanceCents: currentUser.balance_cents, prompt, alreadyOwned: true };
    }
    if (!product.enabled) throw new CommerceError("该灵感模板已下架", 404, "PRODUCT_UNAVAILABLE");
    if (expectedPriceCents !== product.price_cents) {
      throw new CommerceError("商品价格已变化，请刷新后重新确认", 409, "PRICE_CHANGED");
    }
    if (currentUser.balance_cents < product.price_cents) throw new CommerceError("账户余额不足，请先充值", 402, "INSUFFICIENT_BALANCE");

    const purchaseId = randomUUID();
    const orderNo = createOrderNumber();
    const balanceAfter = currentUser.balance_cents - product.price_cents;
    if (product.price_cents > 0) {
      db.prepare("UPDATE commerce_users SET balance_cents = ? WHERE id = ?").run(balanceAfter, viewerId);
    }
    db.prepare(`
      INSERT INTO inspiration_purchases (id, order_no, user_id, product_id, amount_cents, status)
      VALUES (?, ?, ?, ?, ?, 'paid')
    `).run(purchaseId, orderNo, viewerId, productId, product.price_cents);
    db.prepare(`
      INSERT INTO wallet_ledger (id, user_id, business_type, amount_cents, balance_after_cents, reference_id)
      VALUES (?, ?, 'inspiration_purchase', ?, ?, ?)
    `).run(randomUUID(), viewerId, -product.price_cents, balanceAfter, purchaseId);
    db.exec("COMMIT");
    return { orderNo, amountCents: product.price_cents, balanceCents: balanceAfter, prompt, alreadyOwned: false };
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function getInspirationOrders(viewerId: string) {
  const db = getDatabase();
  ensureUser(db, viewerId);
  const rows = db.prepare(`
    SELECT s.id, s.order_no, s.product_id, s.amount_cents, s.status, s.created_at, p.title
    FROM inspiration_purchases s
    JOIN inspiration_products p ON p.id = s.product_id
    WHERE s.user_id = ?
    ORDER BY s.created_at DESC
    LIMIT 100
  `).all(viewerId) as OrderRow[];
  return rows.map(row => ({
    id: row.id,
    orderNo: row.order_no,
    productId: row.product_id,
    title: row.title,
    amountCents: row.amount_cents,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export function updateInspirationProduct(productId: string, changes: { priceCents?: number; enabled?: boolean }) {
  const db = getDatabase();
  const existing = db.prepare("SELECT id FROM inspiration_products WHERE id = ?").get(productId);
  if (!existing) throw new CommerceError("灵感商品不存在", 404, "PRODUCT_NOT_FOUND");
  if (changes.priceCents !== undefined) {
    if (!Number.isInteger(changes.priceCents) || changes.priceCents < 0 || changes.priceCents > 100_000_00) {
      throw new CommerceError("价格必须是 0 至 100000 元之间的金额", 400, "INVALID_PRICE");
    }
    db.prepare("UPDATE inspiration_products SET price_cents = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(changes.priceCents, productId);
  }
  if (changes.enabled !== undefined) {
    db.prepare("UPDATE inspiration_products SET enabled = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(changes.enabled ? 1 : 0, productId);
  }
  const row = db.prepare(`
    SELECT p.id, p.price_cents, p.enabled,
      (SELECT COUNT(*) FROM inspiration_purchases s WHERE s.product_id = p.id AND s.status = 'paid') AS sales
    FROM inspiration_products p WHERE p.id = ?
  `).get(productId) as Omit<CatalogRow, "purchased">;
  return { id: row.id, priceCents: row.price_cents, enabled: Boolean(row.enabled), sales: row.sales };
}
