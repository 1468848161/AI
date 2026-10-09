import { NextResponse } from "next/server";
import { z } from "zod";
import { CommerceError, purchaseInspiration } from "@/lib/inspiration-commerce";
import { getCommerceViewer } from "@/lib/inspiration-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const purchaseSchema = z.object({ expectedPriceCents: z.number().int().min(0).max(100_000_00) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const viewerId = await getCommerceViewer();
    const { id } = await context.params;
    const payload = purchaseSchema.parse(await request.json());
    return NextResponse.json(purchaseInspiration(viewerId, id, payload.expectedPriceCents), {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "购买参数不正确", code: "INVALID_PAYLOAD" }, { status: 400 });
    }
    if (error instanceof CommerceError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    console.error("Failed to purchase inspiration", error);
    return NextResponse.json({ error: "购买失败，请稍后重试", code: "PURCHASE_FAILED" }, { status: 500 });
  }
}
