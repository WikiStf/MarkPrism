/** 平台元信息：驱动顶部切换按钮与新手引导文案 */
export const PLATFORM_META = {
  default: {
    label: "默认",
    emoji: "📝",
    tagline: "干净排版 · 通用场景",
    tip: "适合知乎、掘金、博客等大多数平台，写完 Markdown 直接点右上角「复制富文本」即可。",
  },
  xiaohongshu: {
    label: "小红书",
    emoji: "📕",
    tagline: "Emoji 标题 · 宽松行距",
    tip: "粘贴小贴士：复制后打开小红书 App →「发布」→ 写长文/笔记正文，长按粘贴即可保留 Emoji 排版。",
  },
  wechat: {
    label: "公众号",
    emoji: "💚",
    tagline: "全内联 CSS · 微信友好",
    tip: "粘贴小贴士：复制后打开公众号后台编辑器（mp.weixin.qq.com），光标放在正文区 Ctrl/Cmd+V 粘贴，样式原样保留。",
  },
} as const;

export const PLATFORM_ORDER = ["default", "xiaohongshu", "wechat"] as const;
