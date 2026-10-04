import type { Platform } from "@/types";

const LS = {
  md: "markprism:draft",
  platform: "markprism:platform",
  seen: "markprism:onboarded",
};

export function loadDraft(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(LS.md);
  } catch {
    return null;
  }
}

export function saveDraft(md: string) {
  try {
    localStorage.setItem(LS.md, md);
  } catch {
    /* 隐私模式下静默失败即可 */
  }
}

export function loadPlatform(): Platform | null {
  if (typeof window === "undefined") return null;
  const p = localStorage.getItem(LS.platform);
  return p === "default" || p === "xiaohongshu" || p === "wechat" ? p : null;
}

export function savePlatform(p: Platform) {
  try {
    localStorage.setItem(LS.platform, p);
  } catch {}
}

export function hasSeenOnboarding(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(LS.seen) === "1";
}

export function markOnboardingSeen() {
  try {
    localStorage.setItem(LS.seen, "1");
  } catch {}
}

/** 下载文本文件（导出 Markdown / HTML 用） */
export function downloadFile(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * 富文本一键复制：HTML + 纯文本同时写入剪贴板。
 * 优先 ClipboardItem；不支持时回退到 selection + execCommand（兼容微信等场景）。
 */
export async function copyRichText(html: string, plain: string): Promise<void> {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    "write" in navigator.clipboard &&
    typeof ClipboardItem !== "undefined"
  ) {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      return;
    } catch {
      /* 继续走兜底方案 */
    }
  }

  // 兜底：渲染到隐藏容器 → Range 选中 → execCommand('copy')
  const holder = document.createElement("div");
  holder.contentEditable = "true";
  holder.style.position = "fixed";
  holder.style.left = "-9999px";
  holder.style.top = "0";
  holder.innerHTML = html;
  document.body.appendChild(holder);

  const range = document.createRange();
  range.selectNodeContents(holder);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
  document.execCommand("copy");
  sel?.removeAllRanges();
  document.body.removeChild(holder);
}

/** 复制纯文本 */
export async function copyText(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}
