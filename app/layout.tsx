import type { Metadata } from "next";
import "./globals.css";
import "./landing-v2.css";
import "./workspace-v2.css";
import "./portal-v2.css";
import "./backoffice-v2.css";

export const metadata: Metadata = {
  title: "灵智 AI - 大模型聚合与智能创作平台",
  description: "聚合全球领先 AI 模型，提供智能对话、AI 绘画、视频、音频、智能体和开放 API 服务。",
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
