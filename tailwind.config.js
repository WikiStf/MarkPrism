/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 品牌主色（柔和靛蓝系）
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#312e81",
        },
        // 平台专属色
        platform: {
          xhs: "#ff2442", // 小红书红
          wechat: "#07c160", // 公众号绿
          default: "#6366f1",
        },
        // 代码块配色（macOS Dark Terminal / Catppuccin Mocha）
        code: {
          bg: "#1e1e2e",
          header: "#181825",
          border: "#313244",
          text: "#cdd6f4",
          comment: "#6c7086",
          keyword: "#cba6f7",
          string: "#a6e3a1",
          func: "#89b4fa",
          number: "#fab387",
          tag: "#f38ba8",
          attr: "#f9e2af",
          dot: {
            red: "#ff5f57", // macOS 关闭
            yellow: "#febc2e", // macOS 最小化
            green: "#28c840", // macOS 最大化
          },
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(99, 102, 241, 0.12)",
        card: "0 1px 3px rgba(0,0,0,0.04), 0 8px 32px -8px rgba(0,0,0,0.08)",
        glow: "0 0 0 3px rgba(99, 102, 241, 0.18)",
        codeblock: "0 12px 40px -12px rgba(30, 30, 46, 0.45)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "toast-in": "toast-in 0.25s ease-out both",
      },
    },
  },
  plugins: [],
};
