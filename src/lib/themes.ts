import type { Platform } from "@/types";

/**
 * 每个平台的排版主题（section 基础样式 + 各标签选择器样式）。
 * 转换时通过 juice 将这些 CSS 内联到每个标签的 style 属性上，
 * 保证粘贴到公众号 / 小红书编辑器后样式不丢失。
 */

const base = (extra: Record<string, string>): Record<string, string> => ({
  "font-family":
    "-apple-system-font, BlinkMacSystemFont, 'Helvetica Neue', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei UI', 'Microsoft YaHei', Arial, sans-serif",
  "font-size": "15px",
  "line-height": "1.75",
  color: "#3f3f3f",
  "letter-spacing": "0.5px",
  "word-break": "break-word",
  ...extra,
});

export function getThemeCss(platform: Platform): string {
  const styles: Record<string, Record<string, string>> = {};
  const s = (sel: string, decls: Record<string, string>) => {
    styles[sel] = { ...(styles[sel] || {}), ...decls };
  };

  if (platform === "xiaohongshu") {
    // —— 小红书：宽松呼吸感、大段间距、强调色用平台红 ——
    s("section", base({ "font-size": "16px", "line-height": "2", margin: "0" }));
    s("p", { margin: "0 0 20px", "text-align": "justify" });
    s("h1", {
      "font-size": "22px",
      "font-weight": "bold",
      margin: "32px 0 18px",
      color: "#222",
      "line-height": "1.5",
    });
    s("h2", {
      "font-size": "19px",
      "font-weight": "bold",
      margin: "28px 0 16px",
      color: "#222",
      "line-height": "1.5",
    });
    s("h3", {
      "font-size": "17px",
      "font-weight": "bold",
      margin: "24px 0 14px",
      color: "#333",
    });
    s("blockquote", {
      margin: "20px 0",
      padding: "12px 18px",
      "background-color": "#fff5f6",
      "border-left": "4px solid #ff2442",
      "border-radius": "8px",
      color: "#555",
      "font-size": "15px",
    });
    s("ul, ol", { margin: "0 0 20px", padding: "0 0 0 26px" });
    s("li", { "margin-bottom": "10px" });
    s("code", {
      "font-family": "'JetBrains Mono', Menlo, Consolas, monospace",
      "font-size": "13px",
      "background-color": "#fdf0f2",
      color: "#d6153b",
      padding: "2px 6px",
      "border-radius": "4px",
    });
    s("pre", {
      "background-color": "#1e1e2e",
      color: "#cdd6f4",
      padding: "18px 16px",
      "border-radius": "12px",
      overflow: "auto",
      margin: "20px 0",
      "line-height": "1.6",
    });
    s("pre code", {
      "background-color": "transparent",
      color: "inherit",
      padding: "0",
      "font-size": "13px",
    });
    s("img", {
      "max-width": "100%",
      "border-radius": "12px",
      display: "block",
      margin: "16px auto",
    });
    s("a", { color: "#ff2442", "text-decoration": "underline" });
    s("hr", {
      border: "none",
      "border-top": "2px dashed #ffcdd5",
      margin: "28px 0",
    });
    s("strong", { color: "#d6153b" });
    s("table", {
      "border-collapse": "collapse",
      width: "100%",
      margin: "20px 0",
      "font-size": "14px",
    });
    s("th, td", {
      border: "1px solid #f3c4cc",
      padding: "8px 10px",
      "text-align": "left",
    });
    s("th", { "background-color": "#fff5f6", "font-weight": "bold" });
  } else if (platform === "wechat") {
    // —— 公众号：微信编辑器友好，主色调用微信绿 ——
    s("section", base({ margin: "0", padding: "0" }));
    s("p", { margin: "0 0 20px", "text-align": "justify" });
    s("h1", {
      "font-size": "22px",
      "font-weight": "bold",
      margin: "40px 0 20px",
      color: "#000",
      "line-height": "1.5",
    });
    s("h2", {
      "font-size": "19px",
      "font-weight": "bold",
      margin: "36px 0 18px",
      color: "#000",
      "line-height": "1.5",
      "padding-left": "12px",
      "border-left": "4px solid #07c160",
    });
    s("h3", {
      "font-size": "17px",
      "font-weight": "bold",
      margin: "30px 0 16px",
      color: "#1a1a1a",
    });
    s("blockquote", {
      margin: "20px 0",
      padding: "12px 18px",
      "background-color": "#f6fef9",
      "border-left": "4px solid #07c160",
      "border-radius": "6px",
      color: "#57606a",
      "font-size": "14px",
    });
    s("ul, ol", { margin: "0 0 20px", padding: "0 0 0 26px" });
    s("li", { "margin-bottom": "8px" });
    s("code", {
      "font-family": "'JetBrains Mono', Menlo, Consolas, monospace",
      "font-size": "13px",
      "background-color": "#f2f8f4",
      color: "#07914a",
      padding: "2px 6px",
      "border-radius": "4px",
    });
    s("pre", {
      "background-color": "#1e1e2e",
      color: "#cdd6f4",
      padding: "18px 16px",
      "border-radius": "10px",
      overflow: "auto",
      margin: "20px 0",
      "line-height": "1.6",
    });
    s("pre code", {
      "background-color": "transparent",
      color: "inherit",
      padding: "0",
      "font-size": "13px",
    });
    s("img", {
      "max-width": "100%",
      "border-radius": "8px",
      display: "block",
      margin: "16px auto",
    });
    s("a", { color: "#07c160", "text-decoration": "none" });
    s("hr", {
      border: "none",
      "border-top": "1px solid #e5e7eb",
      margin: "32px 0",
    });
    s("strong", { color: "#07914a" });
    s("table", {
      "border-collapse": "collapse",
      width: "100%",
      margin: "20px 0",
      "font-size": "14px",
    });
    s("th, td", {
      border: "1px solid #d9ead9",
      padding: "8px 10px",
      "text-align": "left",
    });
    s("th", { "background-color": "#f0faf3", "font-weight": "bold" });
  } else {
    // —— 默认：柔和靛蓝，通用场景 ——
    s("section", base({ margin: "0", padding: "0" }));
    s("p", { margin: "0 0 18px", "text-align": "justify" });
    s("h1", {
      "font-size": "22px",
      "font-weight": "bold",
      margin: "36px 0 18px",
      color: "#1f2937",
    });
    s("h2", {
      "font-size": "19px",
      "font-weight": "bold",
      margin: "32px 0 16px",
      color: "#1f2937",
      "padding-bottom": "8px",
      "border-bottom": "2px solid #e0e7ff",
    });
    s("h3", {
      "font-size": "17px",
      "font-weight": "bold",
      margin: "26px 0 14px",
      color: "#374151",
    });
    s("blockquote", {
      margin: "18px 0",
      padding: "12px 18px",
      "background-color": "#f5f6ff",
      "border-left": "4px solid #a5b4fc",
      "border-radius": "8px",
      color: "#4b5563",
      "font-size": "14px",
    });
    s("ul, ol", { margin: "0 0 18px", padding: "0 0 0 26px" });
    s("li", { "margin-bottom": "8px" });
    s("code", {
      "font-family": "'JetBrains Mono', Menlo, Consolas, monospace",
      "font-size": "13px",
      "background-color": "#eef2ff",
      color: "#4f46e5",
      padding: "2px 6px",
      "border-radius": "4px",
    });
    s("pre", {
      "background-color": "#1e1e2e",
      color: "#cdd6f4",
      padding: "18px 16px",
      "border-radius": "12px",
      overflow: "auto",
      margin: "18px 0",
      "line-height": "1.6",
    });
    s("pre code", {
      "background-color": "transparent",
      color: "inherit",
      padding: "0",
      "font-size": "13px",
    });
    s("img", {
      "max-width": "100%",
      "border-radius": "10px",
      display: "block",
      margin: "16px auto",
    });
    s("a", { color: "#4f46e5", "text-decoration": "underline" });
    s("hr", {
      border: "none",
      "border-top": "1px solid #e5e7eb",
      margin: "28px 0",
    });
    s("strong", { color: "#4338ca" });
    s("table", {
      "border-collapse": "collapse",
      width: "100%",
      margin: "18px 0",
      "font-size": "14px",
    });
    s("th, td", {
      border: "1px solid #dcdfe6",
      padding: "8px 10px",
      "text-align": "left",
    });
    s("th", { "background-color": "#eef2ff", "font-weight": "bold" });
  }

  return Object.entries(styles)
    .map(
      ([sel, decls]) =>
        `${sel} { ${Object.entries(decls)
          .map(([k, v]) => `${k}: ${v};`)
          .join(" ")} }`
    )
    .join("\n");
}
