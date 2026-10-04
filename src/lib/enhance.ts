/** 各平台的标题 Emoji 池：按 h1/h2/h3 顺序轮换，避免单调 */
const EMOJI_POOLS: Record<string, string[]> = {
  h1: ["🚀", "✨", "🔥", "💡", "🎯"],
  h2: ["🌟", "📌", "🎨", "⚡️", "🧩", "📖"],
  h3: ["💡", "👉", "🔧", "🎈", "✅"],
};

/**
 * 为标题自动注入 Emoji（小红书 / 默认模式的"氛围感"来源）。
 * 同一层级多次出现时轮换不同 Emoji；已带 Emoji 的标题不重复添加。
 */
export function injectHeadingEmojis(html: string): string {
  const counters: Record<string, number> = { h1: 0, h2: 0, h3: 0 };

  return html.replace(
    /<(h[1-3])([^>]*)>([\s\S]*?)<\/\1>/g,
    (match, tag: string, attrs: string, inner: string) => {
      const pool = EMOJI_POOLS[tag] ?? EMOJI_POOLS.h2;
      const idx = counters[tag] ?? 0;
      counters[tag] = idx + 1;
      const emoji = pool[idx % pool.length];

      // 已有 emoji 开头则跳过（粗略判断：首字符在常见 emoji 码段）
      const first = inner.trim().codePointAt(0) ?? 0;
      const looksLikeEmoji =
        first >= 0x1f000 || (first >= 0x2600 && first <= 0x27bf);
      if (looksLikeEmoji) return match;

      return `<${tag}${attrs}>${emoji} ${inner}</${tag}>`;
    }
  );
}

/** 小红书模式：段落之间额外增加呼吸感间距 */
export function loosenParagraphs(html: string): string {
  return html.replace(/<p([^>]*)>/g, '<p$1 data-xhs="1">');
}

/**
 * 对"有明确语言标注"的代码块做纯字符串级语法着色（Catppuccin Mocha 风格）。
 * 不做 HTML token 解析——只在转义后的安全文本上做替换，保证 juice 内联后仍生效。
 */
const COLOR = {
  comment: "#6c7086",
  keyword: "#cba6f7",
  string: "#a6e3a1",
  func: "#89b4fa",
  number: "#fab387",
  tag: "#f38ba8",
  attr: "#f9e2af",
};

const KEYWORDS =
  "const|let|var|function|return|if|else|for|while|import|export|from|default|class|new|async|await|try|catch|finally|throw|typeof|instanceof|null|undefined|true|false|this|super|extends|implements|interface|type|enum|public|private|protected|static|readonly|def|self|None|True|False|elif|lambda|pass|with|as|yield|print|struct|fn|mut|impl|pub|use|package|func|nil|end|then|do|module|require|include|using|namespace|template|typename|auto|virtual|override|switch|case|break|continue|delete|in|of|not|and|or";

function span(color: string, text: string) {
  return `<span style="color:${color}">${text}</span>`;
}

function highlightCode(code: string, lang: string): string {
  const l = lang.toLowerCase();
  const isPy = /^(py|python)$/.test(l);
  const isHtml = /^(html|xml|vue|svg)$/.test(l);
  const isCss = /^(css|scss|less)$/.test(l);

  // 1) 注释（// 或 #，python/yaml/bash/shell/ini 用 #）
  const hashComment = isPy || /^(yaml|yml|bash|sh|shell|ini|toml|ruby|rb|makefile|dockerfile)$/.test(l);
  if (hashComment) {
    code = code.replace(/(#[^\n]*)/g, (m) => span(COLOR.comment, m));
  } else if (!isHtml && !isCss) {
    code = code.replace(/(\/\/[^\n]*)/g, (m) => span(COLOR.comment, m));
  }

  // 2) 字符串（HTML 属性里的引号交给第 5 步处理，避免冲突）
  if (!isHtml) {
    code = code.replace(
      /(&quot;.*?&quot;|&#39;[^&]*?&#39;|`[^`]*`)/g,
      (m) => span(COLOR.string, m)
    );
  }

  // 3) 数字
  if (!isHtml && !isCss) {
    code = code.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) => span(COLOR.number, m));
  }

  // 4) 关键字（避开已经被 span 包裹的部分）
  if (!isHtml) {
    const kwRe = new RegExp(
      `(?<![\\w>&#;])\\b(?:${KEYWORDS})\\b(?!\\s*;?\\s*<\/span>)`,
      "g"
    );
    code = code.replace(kwRe, (m) => span(COLOR.keyword, m));
  }

  // 5) HTML 标签名 & 属性
  if (isHtml) {
    code = code.replace(
      /(&lt;\/?)([a-zA-Z][\w-]*)/g,
      (_m, lt, name) => `${span(COLOR.tag, lt)}${span(COLOR.tag, name)}`
    );
    code = code.replace(
      /\s([a-zA-Z-]+)=(&quot;.*?&quot;|&#39;[^&]*?&#39;)/g,
      (_m, sp, attr, val) =>
        `${sp}${span(COLOR.attr, attr)}=${span(COLOR.string, val)}`
    );
  }

  // 6) 函数调用 foo(
  if (!isHtml && !isCss) {
    code = code.replace(
      /\b([a-zA-Z_$][\w$]*)(?=\()/g,
      (m) => span(COLOR.func, m)
    );
  }

  return code;
}

/** 给 pre > code 中每个非空行加行号（左侧灰色 gutter，提升可读性） */
function addLineNumbers(preHtml: string): string {
  return preHtml.replace(
    /<code([^>]*)>([\s\S]*?)<\/code>/,
    (m, attrs: string, inner: string) => {
      const lines = inner.split("\n");
      // marked 常在末尾产生一个空行
      if (lines.length > 1 && lines[lines.length - 1].trim() === "") {
        lines.pop();
      }
      const gutterWidth = String(lines.length).length;
      const numbered = lines
        .map((line, i) => {
          const num = String(i + 1).padStart(gutterWidth, " ");
          return `<span style="color:#585b70;user-select:none">${num}</span>  ${line}`;
        })
        .join("\n");
      return `<code${attrs}>${numbered}</code>`;
    }
  );
}

/**
 * 代码块美化：macOS 红黄绿小圆点 + 语言标签 + 深色卡片。
 * 全部使用内联样式，保证 juice 处理后粘贴到任何编辑器都不走样。
 */
export function decorateCodeBlocks(html: string): string {
  return html.replace(
    /<pre><code(?:\s+class="language-([\w+#-]*)")?>([\s\S]*?)<\/code><\/pre>/g,
    (_m, lang: string | undefined, code: string) => {
      const language = lang ?? "text";
      const colored = highlightCode(code, language);
      const withLines = addLineNumbers(`<pre><code>${colored}</code></pre>`)
        .replace(/^<pre>/, "")
        .replace(/<\/pre>$/, "");

      const raw = code
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      const encoded = encodeURIComponent(raw);

      return [
        `<section style="margin:20px 0;border-radius:12px;overflow:hidden;box-shadow:0 12px 40px -12px rgba(30,30,46,0.45);background-color:#1e1e2e;">`,
        `  <section style="background-color:#181825;padding:10px 14px;display:flex;align-items:center;">`,
        `    <span style="width:12px;height:12px;border-radius:50%;background-color:#ff5f57;display:inline-block;margin-right:7px;"></span>`,
        `    <span style="width:12px;height:12px;border-radius:50%;background-color:#febc2e;display:inline-block;margin-right:7px;"></span>`,
        `    <span style="width:12px;height:12px;border-radius:50%;background-color:#28c840;display:inline-block;"></span>`,
        `    <span style="margin-left:auto;font-size:12px;color:#6c7086;font-family:monospace;">${language}</span>`,
        `    <button type="button" data-copy-code style="margin-left:12px;font-size:12px;color:#89b4fa;background:transparent;border:1px solid #313244;border-radius:6px;padding:2px 8px;cursor:pointer;font-family:monospace;">📋 复制</button>`,
        `    <a href="data:text/plain;charset=utf-8,${encoded}" style="margin-left:8px;font-size:12px;color:#6c7086;text-decoration:none;font-family:monospace;" title="下载代码为 txt 文件">⬇</a>`,
        `  </section>`,
        `  <pre style="margin:0;padding:16px 14px;background-color:#1e1e2e;color:#cdd6f4;font-family:'JetBrains Mono',Menlo,Consolas,monospace;font-size:13px;line-height:1.7;overflow-x:auto;white-space:pre;">${withLines}</pre>`,
        `</section>`,
      ].join("");
    }
  );
}
