"use client";

import { useRef, useState } from "react";
import { TEMPLATES } from "@/lib/templates";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onFormat: () => void;
  onClear: () => void;
  onLoadTemplate: (md: string) => void;
  onExportMd: () => void;
}

const TOOLBAR = [
  { key: "**", before: "**", after: "**", label: "B", title: "加粗 (Ctrl+B)", cls: "font-bold" },
  { key: "*", before: "*", after: "*", label: "I", title: "斜体 (Ctrl+I)", cls: "italic font-serif" },
  { key: "`", before: "`", after: "`", label: "</>", title: "行内代码", cls: "text-xs" },
  { key: "h2", before: "\n## ", after: "\n", label: "H2", title: "二级标题", cls: "text-xs font-semibold" },
  { key: "link", before: "[", after: "](https://)", label: "🔗", title: "链接", cls: "" },
  { key: "list", before: "\n- ", after: "\n", label: "•≡", title: "无序列表", cls: "text-xs" },
  { key: "quote", before: "\n> ", after: "\n", label: "❝", title: "引用", cls: "" },
  {
    key: "codeblock",
    before: "\n```ts\n",
    after: "\n```\n",
    label: "{ }",
    title: "代码块",
    cls: "text-xs font-mono",
  },
];

/** 左侧编辑器：工具栏 + 模板下拉 + textarea + 快捷键 */
export default function Editor({
  value,
  onChange,
  onFormat,
  onClear,
  onLoadTemplate,
  onExportMd,
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tplOpen, setTplOpen] = useState(false);

  /** 在光标处包裹选中文本 */
  const wrap = (before: string, after: string) => {
    const ta = ref.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const next = value.slice(0, s) + before + value.slice(s, e) + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      // 无选中内容时，把光标放进包裹符中间，直接开打
      if (s === e) {
        ta.selectionStart = ta.selectionEnd = s + before.length;
      } else {
        ta.selectionStart = s + before.length;
        ta.selectionEnd = e + before.length;
      }
    });
  };

  // 快捷键：Ctrl/Cmd+B 加粗、Ctrl/Cmd+I 斜体、Ctrl/Cmd+S 导出、Tab 缩进
  const handleKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const mod = ev.metaKey || ev.ctrlKey;
    if (mod && ev.key.toLowerCase() === "b") {
      ev.preventDefault();
      wrap("**", "**");
    } else if (mod && ev.key.toLowerCase() === "i") {
      ev.preventDefault();
      wrap("*", "*");
    } else if (mod && ev.key.toLowerCase() === "s") {
      ev.preventDefault();
      onExportMd();
    } else if (ev.key === "Tab") {
      ev.preventDefault();
      wrap("  ", "");
    }
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-xl2 border border-brand-100 bg-white shadow-card">
      {/* 工具栏 */}
      <div className="flex flex-wrap items-center gap-1 border-b border-brand-50 bg-brand-50/40 px-3 py-2">
        <span className="mr-1 hidden text-xs font-medium text-gray-400 sm:inline">
          ✍️ Markdown 输入
        </span>
        {TOOLBAR.map((t) => (
          <button
            key={t.key}
            type="button"
            title={t.title}
            onClick={() => wrap(t.before, t.after)}
            className={`grid h-7 min-w-7 place-items-center rounded-md px-1.5 text-gray-600 transition-colors hover:bg-white hover:text-brand-600 hover:shadow-soft ${t.cls}`}
          >
            {t.label}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-1">
          {/* 模板下拉 */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setTplOpen((o) => !o)}
              onBlur={() => setTimeout(() => setTplOpen(false), 150)}
              className="flex h-7 items-center gap-1 rounded-md px-2 text-xs text-gray-600 transition-colors hover:bg-white hover:text-brand-600"
              title="插入示例模板"
            >
              📄 模板 ▾
            </button>
            {tplOpen && (
              <ul className="absolute right-0 top-8 z-20 w-36 overflow-hidden rounded-xl border border-brand-100 bg-white py-1 shadow-card">
                {TEMPLATES.map((tpl) => (
                  <li key={tpl.name}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        onLoadTemplate(tpl.content);
                        setTplOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-brand-50"
                    >
                      <span>{tpl.emoji}</span> {tpl.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="button"
            onClick={onFormat}
            className="h-7 rounded-md px-2 text-xs text-gray-600 transition-colors hover:bg-white hover:text-brand-600"
            title="一键整理：统一列表符号 / 压缩空行 / 去行尾空格"
          >
            🪄 排版
          </button>
          <button
            type="button"
            onClick={onExportMd}
            className="h-7 rounded-md px-2 text-xs text-gray-600 transition-colors hover:bg-white hover:text-brand-600"
            title="导出 .md 文件 (Ctrl+S)"
          >
            ⬇ 导出
          </button>
          <button
            type="button"
            onClick={onClear}
            className="h-7 rounded-md px-2 text-xs text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-500"
            title="清空（内容会自动保存在本地，刷新不丢）"
          >
            🗑 清空
          </button>
        </div>
      </div>

      {/* 编辑区 */}
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        placeholder={"在这里输入或粘贴 Markdown……\n\n不知道从哪开始？点上方「📄 模板」看效果。"}
        className="min-h-[240px] flex-1 resize-none bg-transparent p-4 font-mono text-[13.5px] leading-relaxed text-gray-800 outline-none placeholder:text-gray-300"
      />

      {/* 底部提示 */}
      <div className="border-t border-brand-50 px-4 py-2 text-[11px] text-gray-400">
        💾 自动保存到浏览器 · ⌨️ Ctrl+B 加粗 / Ctrl+I 斜体 / Tab 缩进 ·{" "}
        <span className="hidden sm:inline">支持表格、任务列表、代码块语法着色</span>
      </div>
    </section>
  );
}
