"use client";

import { useEffect, useRef } from "react";
import type { ConvertResult, Platform } from "@/types";
import { PLATFORM_META } from "@/lib/platforms";

interface Props {
  result: ConvertResult | null;
  loading: boolean;
  platform: Platform;
  isEmpty: boolean;
  onCopyRich: () => void;
  onCopyPlain: () => void;
  onExportHtml: () => void;
  onPickTemplate: () => void;
}

/** 右侧预览区：所见即所得 + 复制按钮组 + 平台粘贴小贴士 */
export default function Preview({
  result,
  loading,
  platform,
  isEmpty,
  onCopyRich,
  onCopyPlain,
  onExportHtml,
  onPickTemplate,
}: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);

  // 预览区内代码块的"复制代码"按钮（事件委托，避免 React 管理内联 HTML）
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const onClick = async (ev: MouseEvent) => {
      const btn = (ev.target as HTMLElement).closest?.("[data-copy-code]");
      if (!btn || !el.contains(btn)) return;
      const pre = btn.closest("section")?.querySelector("pre");
      if (!pre) return;
      try {
        await navigator.clipboard.writeText(pre.textContent ?? "");
        btn.textContent = "✅ 已复制";
        setTimeout(() => (btn.textContent = "📋 复制"), 1500);
      } catch {
        btn.textContent = "❌ 失败";
      }
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [result]);

  const meta = PLATFORM_META[platform];

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl2 border border-brand-100 bg-white shadow-card">
      {/* 头部：标题 + 操作按钮 */}
      <div className="flex items-center gap-2 border-b border-brand-50 bg-brand-50/40 px-4 py-2.5">
        <span className="text-xs font-medium text-gray-400">
          👀 实时预览 · {meta.emoji} {meta.label}模式
        </span>
        {loading && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={onCopyPlain}
            disabled={!result}
            className="hidden h-8 items-center rounded-lg border border-gray-200 px-3 text-xs text-gray-500 transition-colors hover:border-brand-300 hover:text-brand-600 disabled:opacity-40 sm:flex"
            title="复制无样式的纯文本"
          >
            复制纯文本
          </button>
          <button
            onClick={onExportHtml}
            disabled={!result}
            className="hidden h-8 items-center rounded-lg border border-gray-200 px-3 text-xs text-gray-500 transition-colors hover:border-brand-300 hover:text-brand-600 disabled:opacity-40 md:flex"
            title="导出带样式的 .html 文件"
          >
            ⬇ HTML
          </button>
          <button
            onClick={onCopyRich}
            disabled={!result}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 text-sm font-semibold text-white shadow-soft transition-all hover:shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-40"
            title="富文本+纯文本双格式写入剪贴板 (Ctrl/Cmd+Shift+C)"
          >
            📋 复制富文本
          </button>
        </div>
      </div>

      {/* 正文预览（手机宽度模拟，贴近真实发布效果） */}
      <div className="flex-1 overflow-y-auto bg-[#fafaff] px-4 py-6 sm:px-8">
        {isEmpty ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
            <div className="text-5xl">🪄</div>
            <p className="text-sm font-medium text-gray-500">
              左边输入 Markdown，这里立刻变成社媒排版
            </p>
            <button
              onClick={onPickTemplate}
              className="rounded-full bg-brand-50 px-4 py-2 text-sm text-brand-600 transition-colors hover:bg-brand-100"
            >
              🚀 不知道怎么写？插入一个示例看看
            </button>
            <ul className="mt-2 space-y-1.5 text-left text-xs text-gray-400">
              <li>1️⃣ 左侧粘贴或编写 Markdown</li>
              <li>2️⃣ 顶部选择目标平台（默认 / 小红书 / 公众号）</li>
              <li>3️⃣ 点右上角「复制富文本」，去目标 App 直接粘贴</li>
            </ul>
          </div>
        ) : (
          <>
            <article
              ref={bodyRef}
              className="mp-preview mx-auto max-w-[677px] rounded-xl2 bg-white p-6 shadow-card sm:p-8"
              dangerouslySetInnerHTML={{ __html: result?.html ?? "" }}
            />
            {/* 新手引导：字数统计 + 平台粘贴贴士 */}
            <div className="mx-auto mt-4 max-w-[677px] space-y-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 px-2 text-[11px] text-gray-400">
                <span>📊 约 {result?.stats.words ?? 0} 字</span>
                <span>{result?.stats.chars ?? 0} 字符</span>
                <span>💻 {result?.stats.codeBlocks ?? 0} 个代码块</span>
                <span>🖼 {result?.stats.images ?? 0} 张图</span>
                {(result?.stats.words ?? 0) > 1200 && (
                  <span className="text-amber-500">
                    ⚠️ 小红书建议正文 ≤ 1000 字，可适当精简
                  </span>
                )}
              </div>
              <p className="rounded-xl bg-brand-50/70 px-4 py-2.5 text-xs leading-relaxed text-gray-500">
                💡 {meta.tip}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
