import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "lingzhi_market_session";
const ONE_YEAR = 60 * 60 * 24 * 365;

function sessionSecret() {
  const secret = process.env.SAAS_SESSION_SECRET || process.env.NEW_API_SESSION_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") throw new Error("SAAS_SESSION_SECRET is required in production");
  return "development-only-inspiration-session-secret";
}

function signature(viewerId: string) {
  return createHmac("sha256", sessionSecret()).update(viewerId).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function parseSession(value?: string) {
  if (!value) return null;
  const separator = value.lastIndexOf(".");
  if (separator < 1) return null;
  const viewerId = value.slice(0, separator);
  const suppliedSignature = value.slice(separator + 1);
  if (!/^[0-9a-f-]{36}$/i.test(viewerId) || !safeEqual(signature(viewerId), suppliedSignature)) return null;
  return viewerId;
}

export async function getCommerceViewer() {
  const cookieStore = await cookies();
  const existing = parseSession(cookieStore.get(COOKIE_NAME)?.value);
  if (existing) return existing;

  const viewerId = randomUUID();
  cookieStore.set(COOKIE_NAME, `${viewerId}.${signature(viewerId)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && process.env.SAAS_COOKIE_SECURE !== "false",
    maxAge: ONE_YEAR,
    path: "/",
  });
  return viewerId;
}

export function isValidAdminKey(candidate: string | null) {
  const expected = process.env.SAAS_ADMIN_KEY;
  if (!expected) return process.env.NODE_ENV !== "production";
  return safeEqual(expected, candidate || "");
}
