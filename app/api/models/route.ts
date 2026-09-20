import { NextResponse } from "next/server";
import { newApiRequest, type NewApiModel } from "@/lib/new-api";

const demoModels: NewApiModel[] = [
  { id: "gpt-5", owned_by: "openai" },
  { id: "claude-sonnet-4-5", owned_by: "anthropic" },
  { id: "gemini-2.5-pro", owned_by: "google" },
  { id: "deepseek-v3", owned_by: "deepseek" },
];

export async function GET(request: Request) {
  if (!process.env.NEW_API_BASE_URL) {
    return NextResponse.json({ object: "list", data: demoModels, demo: true });
  }
  try {
    const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    const data = await newApiRequest<{ data: NewApiModel[] }>("/v1/models", {}, auth);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "请求失败" }, { status: 502 });
  }
}
