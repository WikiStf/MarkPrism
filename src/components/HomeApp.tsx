"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ConvertResult, Platform, ToastItem } from "@/types";
import { convertMarkdown, autoFormat } from "@/lib/converter";
import { copyRichText, copyText, downloadFile, loadDraft, loadPlatform, saveDraft, savePlatform, hasSeenOnboarding, markOnboardingSeen } from "@/lib/clipboard";
import { SAMPLE_MD } from "@/lib/templates";
import Header from "./Header";
import Editor from "./Editor";
import Preview from "./Preview";
import Toast from "./Toast";

let toastSeq = 0;

export default function Home() {
  const [markdown, setMarkdown] = useState("");
  const [platform, setPlatform] = useState<Platform>("default");
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const resultRef = useRef<ConvertResult | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const pushToast = useCallback(
    (message: string, type: ToastItem["type"] = "success") => {
      setToasts((prev) => [...prev.slice(-2), { id: ++toastSeq, message, type }]);
    },
    []
  );

  const closeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // —— 初始化：恢复草稿 / 平台偏好 / 新手引导 ——
  useEffect(() => {
    const savedPlatform = loadPlatform();
    if (savedPlatform) setPlatform(savedPlatform);
    const draft = loadDraft();
    if (draft !== null && draft !== "") {
      setMarkdown(draft);
    } else if (!hasSeenOnboarding()) {
      setShowGuide(true);
    }
  }, []);

  // —— 草稿自动保存（防抖） ——
  useEffect(() => {
    const t = setTimeout(() => saveDraft(markdown), 400);
    return () => clearTimeout(t);
  }, [markdown]);

  // —— 转换（防抖 250ms，输入即预览） ——
  useEffect(() => {
    if (!markdown.trim()) {
      setResult(null);
      resultRef.current = null;
      setLoading(false);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await convertMarkdown(markdown, platform);
        setResult(r);
        resultRef.current = r;
      } catch (e) {
        pushToast("转换失败，请检查 Markdown 语法", "error");
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [markdown, platform, pushToast]);

  // —— 全局快捷键：Ctrl/Cmd+Shift+C 复制富文本 ——
  useEffect(() => {
    const handler = (ev: KeyboardEvent) => {
      if ((ev.metaKey || ev.ctrlKey) && ev.shiftKey && ev.key.toLowerCase() === "c") {
        ev.preventDefault();
        handleCopyRich();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePlatformChange = (p: Platform) => {
    setPlatform(p);
    savePlatform(p);
  };

  const handleCopyRich = async () => {
    const r = resultRef.current;
    if (!r) return pushToast("请先输入内容", "info");
    try {
      await copyRichText(r.html, r.plain);
      pushToast("复制成功！去目标 App 直接粘贴吧 🎉");
    } catch {
      pushToast("复制失败，请使用 Chrome / Edge 浏览器", "error");
    }
  };

  const handleCopyPlain = async () => {
    const r = resultRef.current;
    if (!r) return pushToast("请先输入内容", "info");
    try {
      await copyText(r.plain);
      pushToast("纯文本已复制 📄");
    } catch {
      pushToast("复制失败", "error");
    }
  };

  const handleExportHtml = () => {
    const r = resultRef.current;
    if (!r) return pushToast("请先输入内容", "info");
    const doc = `<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>MarkPrism Export</title></head><body style="max-width:677px;margin:40px auto;padding:0 16px;">${r.html}</body></html>`;
    downloadFile("markprism-export.html", doc, "text/html");
    pushToast("HTML 已导出 ⬇", "info");
  };

  const handleExportMd = () => {
    if (!markdown.trim()) return pushToast("没有可导出的内容", "info");
    downloadFile("markprism.md", markdown, "text/markdown");
    pushToast("Markdown 已导出 ⬇", "info");
  };

  const handleFormat = () => {
    setMarkdown((md) => autoFormat(md));
    pushToast("已一键排版 🪄", "info");
  };

  const handleClear = () => {
    setMarkdown("");
    pushToast("已清空（刷新前可按 Ctrl+Z 撤销编辑）", "info");
  };

  const handleLoadTemplate = (tpl: string) => {
    setMarkdown(tpl);
    setShowGuide(false);
    markOnboardingSeen();
  };

  return (
    <main className="flex min-h-dvh flex-col bg-gradient-to-br from-brand-50 via-white to-orange-50/40">
      <Header platform={platform} onChange={handlePlatformChange} />

      {/* 首次使用引导条 */}
      {showGuide && (
        <div className="border-b border-brand-100 bg-gradient-to-r from-brand-50 to-platform-xhs/5 px-4 py-2.5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-600">
            <span className="font-semibold">👋 第一次使用？三步搞定：</span>
            <span>① 粘贴 Markdown</span>
            <span>② 选平台</span>
            <span>③ 点「复制富文本」</span>
            <button
              onClick={() => handleLoadTemplate(SAMPLE_MD)}
              className="rounded-full bg-brand-600 px-3 py-1 font-medium text-white transition-transform hover:scale-105"
            >
              🚀 载入示例体验
            </button>
            <button
              onClick={() => {
                setShowGuide(false);
                markOnboardingSeen();
              }}
              className="text-gray-400 underline-offset-2 hover:underline"
            >
              不再提示
            </button>
          </div>
        </div>
      )}

      {/* 左右分栏：移动端上下排列 */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-2 lg:gap-6">
        <div className="min-h-[45dvh] lg:h-[calc(100dvh-108px)] lg:min-h-0">
          <Editor
            value={markdown}
            onChange={setMarkdown}
            onFormat={handleFormat}
            onClear={handleClear}
            onLoadTemplate={handleLoadTemplate}
            onExportMd={handleExportMd}
          />
        </div>
        <div className="min-h-[45dvh] lg:h-[calc(100dvh-108px)] lg:min-h-0">
          <Preview
            result={result}
            loading={loading}
            platform={platform}
            isEmpty={!markdown.trim()}
            onCopyRich={handleCopyRich}
            onCopyPlain={handleCopyPlain}
            onExportHtml={handleExportHtml}
            onPickTemplate={() => handleLoadTemplate(SAMPLE_MD)}
          />
        </div>
      </div>

      {/* 页脚 */}
      <footer className="px-4 pb-6 pt-2 text-center text-[11px] text-gray-400">
        MarkPrism · 本地转换不上传内容，隐私无忧 🔒 · MIT Licensed
      </footer>

      <Toast toasts={toasts} onClose={closeToast} />
    </main>
  );
}
