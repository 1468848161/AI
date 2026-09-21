import type { Metadata } from "next";
import "./globals.css";
import "./landing.css";
import "./admin.css";
import "./ui-themes.css";

export const metadata: Metadata = {
  title: "灵智云 AI - 一站式智能创作平台",
  description: "聚合全球领先 AI 模型，为个人与团队提供对话、绘画、视频、音频及开放 API 服务。",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
