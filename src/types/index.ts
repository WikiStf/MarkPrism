export type Platform = "default" | "xiaohongshu" | "wechat";

export interface PlatformMeta {
  id: Platform;
  label: string;
  emoji: string;
  tagline: string;
  /** Tailwind 平台主色 class（按钮激活态用） */
  accentText: string;
  accentBg: string;
  accentRing: string;
}

export interface ConvertResult {
  /** 内联样式后的完整 HTML（可直接粘贴到公众号 / 小红书编辑器） */
  html: string;
  /** 纯文本版本（去样式、去 Markdown 符号） */
  plain: string;
  /** 统计信息，用于新手引导提示 */
  stats: {
    words: number;
    chars: number;
    lines: number;
    codeBlocks: number;
    images: number;
  };
}

export interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}
