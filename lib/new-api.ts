const baseUrl = process.env.NEW_API_BASE_URL?.replace(/\/$/, "");

export type NewApiModel = { id: string; object?: string; owned_by?: string };

export async function newApiRequest<T>(
  path: string,
  init: RequestInit = {},
  userToken?: string,
): Promise<T> {
  if (!baseUrl) throw new Error("NEW_API_BASE_URL 未配置");
  const token = userToken || process.env.NEW_API_ADMIN_TOKEN;
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) throw new Error(`New API 请求失败：${response.status}`);
  return response.json() as Promise<T>;
}
