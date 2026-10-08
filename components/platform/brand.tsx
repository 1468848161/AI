"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";

export type SiteTheme = "nebula" | "aurora" | "cloud" | "gold";

export const siteThemes: { id: SiteTheme; name: string; description: string; colors: string[] }[] = [
  { id: "nebula", name: "星环深海", description: "青蓝霓虹与深色创作工作台", colors: ["#090b10", "#0fc5d8", "#6557e8"] },
  { id: "aurora", name: "极光幻境", description: "紫粉渐变与创作者社区风格", colors: ["#100b24", "#8b5cf6", "#ec4899"] },
  { id: "cloud", name: "云端简白", description: "企业级明亮界面与品牌蓝", colors: ["#f5f7fb", "#2563eb", "#7dd3fc"] },
  { id: "gold", name: "曜石金", description: "黑金高端会员与商务风格", colors: ["#0b0a09", "#d6aa55", "#70511f"] },
];

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  return <span className={`brand-logo ${compact ? "compact" : ""}`}>
    <i><Sparkles size={17}/></i>
    {!compact && <><b>灵智</b><em>AI</em></>}
  </span>;
}

const themeListeners = new Set<() => void>();

function readTheme(): SiteTheme {
  if (typeof window === "undefined") return "nebula";
  const saved = localStorage.getItem("lingzhi-theme") as SiteTheme | null;
  return saved && siteThemes.some(item => item.id === saved) ? saved : "nebula";
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === "lingzhi-theme") listener();
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

export function useSiteTheme() {
  const theme = useSyncExternalStore<SiteTheme>(subscribeTheme, readTheme, () => "nebula");
  useEffect(() => {
    document.documentElement.dataset.siteTheme = theme;
  }, [theme]);
  function changeTheme(next: SiteTheme) {
    localStorage.setItem("lingzhi-theme", next);
    document.documentElement.dataset.siteTheme = next;
    themeListeners.forEach(listener => listener());
  }
  return { theme, changeTheme };
}
