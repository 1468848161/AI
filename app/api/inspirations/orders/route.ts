import { NextResponse } from "next/server";
import { getInspirationOrders } from "@/lib/inspiration-commerce";
import { getCommerceViewer } from "@/lib/inspiration-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const viewerId = await getCommerceViewer();
  return NextResponse.json({ orders: getInspirationOrders(viewerId) }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
