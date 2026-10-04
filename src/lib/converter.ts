import { marked } from "marked";
import juice from "juice";
import type { Platform, ConvertResult } from "@/types";
import { getThemeCss } from "./themes";
import { decorateCodeBlocks, injectHeadingEmojis } from "./enhance";

// GFM：表格、删除线、任务列表；breaks：单个换行也渲染为 <br>（社媒写作习惯）
marked.setOptions({ gfm: true, breaks: true });

const XHS_SPACER = `<p style="font-size:6px;line-height:6px;margin:0;height:6px;">&nbsp;</p>`;

/** Markdown → 带内联样式的社媒 HTML + 纯文本 + 统计信息 */
export async function convertMarkdown(
  markdown: string,
  platform: Platform
): Promise<ConvertResult> {
  const rawHtml = await marked.parse(markdown || "");

  // 1) 代码块美化（macOS 圆点 + 语法着色 + 行号，全部内联样式）
  let html = decorateCodeBlocks(rawHtml);

  // 2) Emoji 注入：小红书必开；默认模式同样提供（公众号保持克制不加）
  if (platform === "xiaohongshu" || platform === "default") {
    html = injectHeadingEmojis(html);
  }

  // 3) CSS 内联化：主题样式通过 juice 写入每个标签的 style 属性。
  //    先用占位符保护已美化的代码块（内部 pre/code 不能被主题样式二次覆盖），转换完再逐块还原。
  const CODE_TOKEN = "\u0000MP_CODE_BLOCK\u0000";
  const codeBlocks: string[] = [];
  html = html.replace(
    /<section style="margin:20px 0;border-radius:12px;overflow:hidden[\s\S]*?<\/pre>\s*<\/section>/g,
    (m) => {
      codeBlocks.push(m);
      return CODE_TOKEN;
    }
  );

  const themeCss = getThemeCss(platform);
  let inlined = juice(`<section>${html}</section>`, {
    extraCss: themeCss,
    applyStyleTags: true,
    removeStyleTags: true,
    preserveImportant: true,
  });

  // 去掉最外层 section 包裹，返回正文片段（预览与复制都用它）
  inlined = inlined.replace(/^<section[^>]*>/, "").replace(/<\/section>\s*$/, "");
  for (const block of codeBlocks) {
    inlined = inlined.replace(CODE_TOKEN, block);
  }
  html = inlined;

  // 4) 小红书：段与段之间插入细 spacer，制造"呼吸感"
  if (platform === "xiaohongshu") {
    html = html.replace(/<\/p>/g, `</p>${XHS_SPACER}`);
  }

  const plain = htmlToPlainText(html);

  return {
    html,
    plain,
    stats: {
      words: countWords(plain),
      chars: plain.replace(/\s/g, "").length,
      lines: plain.split("\n").filter((l) => l.trim()).length,
      codeBlocks: (rawHtml.match(/<pre>/g) || []).length,
      images: (rawHtml.match(/<img/g) || []).length,
    },
  };
}

/** HTML → 纯文本（复制时同时写入剪贴板，保证任何输入框都能粘贴出内容） */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|blockquote|pre|tr|section)>/gi, "\n")
    .replace(/<(li)[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** 中英混合字数统计：中文按字符计，英文按单词计（近似公众号后台口径） */
export function countWords(text: string): number {
  const cleaned = text.replace(/[\s\u3000]/g, "");
  const cjkMatches = cleaned.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g);
  const nonCjk = cleaned
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, " ")
    .trim();
  const latinWords = nonCjk
    ? nonCjk.split(/[^A-Za-z0-9\u00C0-\u024F]+/).filter(Boolean).length
    : 0;
  return (cjkMatches?.length ?? 0) + latinWords;
}

/** 一键排版：标题自动加粗符号统一、清理多余空行、列表符号统一为 - */
export function autoFormat(md: string): string {
  return md
    .replace(/^([ \t]*)[*] /gm, "$1- ") // * 列表 → -
    .replace(/^([ \t]*)[+] /gm, "$1- ") // + 列表 → -
    .replace(/\n{3,}/g, "\n\n") // 压缩连续空行
    .replace(/[ \t]+$/gm, "") // 去掉行尾空格
    .replace(/。(?=\S)/g, "。 ") // 句号后无空格时补空格（轻度润色）
    .trimEnd() + "\n";
}
