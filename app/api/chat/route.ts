import { NextResponse } from "next/server";
import { newApiRequest } from "@/lib/new-api";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!process.env.NEW_API_BASE_URL) {
      return NextResponse.json({ choices: [{ message: { role: "assistant", content: "演示模式：配置 NEW_API_BASE_URL 后即可连接真实模型。" } }], demo: true });
    }
    const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const data = await newApiRequest("/v1/chat/completions", { method: "POST", body: JSON.stringify(body) }, auth);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "请求失败" }, { status: 502 });
  }
}
