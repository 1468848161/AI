import { NextResponse } from "next/server";
import { z } from "zod";
import { CommerceError, updateInspirationProduct } from "@/lib/inspiration-commerce";
import { isValidAdminKey } from "@/lib/inspiration-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const updateSchema = z.object({
  priceCents: z.number().int().min(0).max(100_000_00).optional(),
  enabled: z.boolean().optional(),
}).refine(value => value.priceCents !== undefined || value.enabled !== undefined, "没有可更新的字段");

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!isValidAdminKey(request.headers.get("x-admin-key"))) {
    return NextResponse.json({ error: "管理密钥错误或已失效", code: "ADMIN_UNAUTHORIZED" }, { status: 401 });
  }
  try {
    const payload = updateSchema.parse(await request.json());
    const { id } = await context.params;
    return NextResponse.json({ item: updateInspirationProduct(id, payload) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || "提交数据不正确", code: "INVALID_PAYLOAD" }, { status: 400 });
    }
    if (error instanceof CommerceError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
    }
    console.error("Failed to update inspiration", error);
    return NextResponse.json({ error: "保存失败，请稍后重试", code: "UPDATE_FAILED" }, { status: 500 });
  }
}
