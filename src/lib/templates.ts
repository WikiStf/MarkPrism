/** 内置示例模板：新手点一下就能看到完整效果 */

export const SAMPLE_MD = `# MarkPrism 快速上手

只需三步：**粘贴 Markdown → 选平台 → 复制富文本**，排版焦虑就此消失 ✨

## 为什么需要它

- 写作用 Markdown，发布却要为小红书 / 公众号手动调格式
- 标题加 Emoji、段落留白、代码块美化，全是重复劳动
- **MarkPrism 一键搞定**，粘贴过去样式原样保留

## 支持的功能

1. 标题自动注入 Emoji（🚀 / 🌟 / 💡 轮换）
2. 代码块自带 macOS 圆点 + 语法着色 + 行号
3. 表格、引用、图片全部按平台主题重排

### 代码块效果

\`\`\`ts
// TypeScript 示例：转换只需一个函数
async function publish(md: string) {
  const html = await convertMarkdown(md, "xiaohongshu");
  await copyRichText(html); // 富文本 + 纯文本双格式
  console.log("发布成功 🎉");
}
\`\`\`

### 引用与表格

> 💡 提示：切换到「公众号」模式后，所有样式都会内联到标签上，微信编辑器完全兼容。

| 平台 | 特色 |
| ---- | ---- |
| 小红书 | Emoji 标题 + 宽松行距 |
| 公众号 | 全内联 CSS + 微信绿主题 |

---

祝你创作愉快，快去试试右上角的 **复制富文本** 吧！`;

export interface Template {
  name: string;
  emoji: string;
  content: string;
}

export const TEMPLATES: Template[] = [
  { name: "快速上手", emoji: "🚀", content: SAMPLE_MD },
  {
    name: "小红书笔记",
    emoji: "📕",
    content: `# 我的效率工具清单 🎒

## 一、写作类

- Notion：一切皆 Block
- Obsidian：本地知识库神器
- **MarkPrism**：Markdown 一键转社媒排版 ✨

## 二、设计类

1. Figma 协作设计
2. Rayso 生成封面图

> 收藏这篇，从此告别"排版两小时，发布三秒钟"！

#效率工具 #自媒体 #程序员`,
  },
  {
    name: "公众号推文",
    emoji: "💚",
    content: `# 深度解析：为什么你的公众号排版总被说丑

## 问题出在哪

大多数开发者用 Markdown 写作，但微信编辑器**不认 Markdown**：

- 样式表被剥离，只剩纯文本
- 代码块糊成一团
- 行距、段距全靠手调

## 解法：内联 CSS

把样式直接写进每个标签的 \`style\` 属性，微信就无法剥离了。

\`\`\`html
<p style="line-height: 1.75; margin-bottom: 20px;">
  这样粘贴过去，样式原样保留。
</p>
\`\`\`

这就是 MarkPrism 在「公众号模式」下做的事情。`,
  },
];
