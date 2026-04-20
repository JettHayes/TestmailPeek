# ⬡ TestmailPeek

> 简洁优雅的 [Testmail.app](https://testmail.app) 邮件在线预览工具

Testmail 免费版仅支持 JSON 格式查看邮件，使用体验不佳。**TestmailPeek** 提供了一个可视化的 Web 界面，让你能够直接在浏览器中预览邮件内容，支持 HTML 富文本渲染与附件下载。

---

## ✨ 功能特性

- 📨 **邮件列表浏览** — 分页加载收件箱，一键切换查看
- 🖼️ **HTML 渲染** — 支持 HTML 富文本邮件的完整预览
- 📎 **附件下载** — 直接下载邮件附件，显示文件大小
- 🔐 **凭证本地存储** — Namespace 和 API Key 自动缓存至 localStorage
- 📱 **响应式布局** — 适配桌面端与移动端
- ⚡ **零构建部署** — 纯静态前端 + Serverless API 代理，无需 Node.js 构建

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Vue 3 (CDN 引入，无构建) |
| UI 组件 | Element Plus |
| 样式 | 原生 CSS 自定义属性 |
| 字体 | Sora + Source Sans 3 |
| API 代理 | Vercel Serverless Functions |
| 部署平台 | Vercel |

---

## 🚀 部署指南

### Vercel 部署（推荐）

1. Fork 本仓库到你的 GitHub 账号
2. 登录 [Vercel](https://vercel.com)，点击 **New Project**
3. 导入 Fork 后的仓库
4. 无需修改任何配置，直接点击 **Deploy**

> 项目为纯静态结构，Vercel 会自动识别 `api/` 目录作为 Serverless Functions，无需额外设置。

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/JettHayes/TestmailPeek.git
cd TestmailPeek

# 使用任意静态服务器启动（如 VS Code Live Server）
# API 代理需要 Vercel CLI：
npx vercel dev
```

---

## 📁 项目结构

```
TestmailPeek/
├── api/
│   └── emails.js          # Vercel Serverless Function（API 代理）
├── index.html             # 入口页面
├── app.js                 # 主应用逻辑（原生 JS + Vue 3 渲染）
├── app.css                # 全局样式
├── mock-server.js         # 本地开发用 Mock 数据
├── vercel.json            # Vercel 部署配置
└── README.md
```

---

## 🔧 使用方式

1. 在 [Testmail.app](https://testmail.app) 注册并获取 **Namespace** 和 **API Key**
2. 打开部署后的页面，在顶部输入栏填入凭证
3. 点击 **获取邮件**，即可浏览和预览收件箱中的邮件

---

## 📄 License

[MIT License](./LICENSE) © [JettHayes](https://github.com/JettHayes)
