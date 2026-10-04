import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarkPrism · Markdown 一键转小红书/公众号排版",
  description:
    "开源社媒排版神器：粘贴 Markdown，自动注入 Emoji、美化代码块、内联 CSS，一键复制富文本，直接发布到小红书和微信公众号。本地转换，隐私无忧。",
  keywords: [
    "Markdown",
    "小红书排版",
    "公众号排版",
    "微信编辑器",
    "富文本复制",
    "开源工具",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
