"use client";

import type { Platform } from "@/types";
import { PLATFORM_META, PLATFORM_ORDER } from "@/lib/platforms";

interface Props {
  platform: Platform;
  onChange: (p: Platform) => void;
}

/** 顶部导航：Logo + 平台切换（带 tagline，新手一看就懂每个模式的差别） */
export default function Header({ platform, onChange }: Props) {

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-xl2 bg-gradient-to-br from-brand-500 to-brand-700 text-lg shadow-soft">
            🔮
          </div>
          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight text-gray-900">
              MarkPrism
            </p>
            <p className="hidden text-[11px] text-gray-400 sm:block">
              Markdown → 社媒排版 · 一键复制
            </p>
          </div>
        </div>

        {/* 平台切换 */}
        <nav
          className="mx-auto flex items-center gap-1 rounded-full bg-brand-50 p-1"
          aria-label="平台切换"
        >
          {PLATFORM_ORDER.map((id) => {
            const meta = PLATFORM_META[id];
            const active = id === platform;
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                title={meta.tagline}
                className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all sm:px-4 ${
                  active
                    ? "bg-white text-gray-900 shadow-soft"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <span>{meta.emoji}</span>
                <span className="hidden sm:inline">{meta.label}</span>
                {active && (
                  <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* 当前模式说明（移动端隐藏，桌面端展示） */}
        <p className="hidden w-40 shrink-0 truncate text-right text-xs text-gray-400 lg:block">
          {PLATFORM_META[platform].tagline}
        </p>

        {/* GitHub 占位 */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.preventDefault()}
          className="hidden h-9 w-9 place-items-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-brand-300 hover:text-brand-600 md:grid"
          title="GitHub（即将上线）"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor" width="18" height="18">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2c-3.2.7-3.87-1.54-3.87-1.54-.53-1.33-1.28-1.7-1.28-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.68 5.38-5.24 5.67.41.36.78 1.06.78 2.14v3.16c0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
          </svg>
        </a>
      </div>

      {/* 移动端：当前模式 tagline */}
      <p className="border-t border-brand-50 bg-brand-50/50 px-4 py-1.5 text-center text-xs text-gray-500 lg:hidden">
        {PLATFORM_META[platform].emoji} {PLATFORM_META[platform].tagline}
      </p>

    </header>
  );
}
