# LazyTrans

<p align="center">
  <img src="src/assets/logo.svg" alt="LazyTrans Logo" width="120" height="120">
</p>

<p align="center">
  <strong>轻量、快捷的桌面翻译工具</strong>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#技术架构">技术架构</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#开发指南">开发指南</a> •
  <a href="#项目结构">项目结构</a>
</p>

---

## 简介

**LazyTrans** 是一款基于 Tauri 构建的桌面翻译应用，专为追求效率和简洁的用户设计。它采用多窗口独立架构，提供悬浮翻译、截图翻译、系统设置等功能，让你在工作流中无缝完成翻译任务。

## 功能特性

### 🎯 悬浮翻译窗口
- **无边框设计**：透明背景，无系统装饰，干净简洁
- **置顶显示**：始终保持在最上层，不影响其他工作
- **自由拖动**：支持拖拽移动位置，灵活摆放
- **快捷操作**：通过系统托盘或快捷键快速唤起/隐藏

### ⚙️ 设置窗口
- **多标签配置**：通用、外观、快捷键、语言、关于五大模块
- **路由导航**：流畅的单页应用体验
- **独立进程**：设置窗口独立运行，不影响主功能

### 📸 截图翻译（开发中）
- **全屏遮罩**：覆盖整个屏幕进行区域选择
- **快捷键支持**：ESC 快速退出截图模式
- **OCR 集成**：计划集成 OCR 识别文字并自动翻译

### 🖥️ 系统托盘
- **常驻后台**：启动后驻留系统托盘，随时可用
- **快捷菜单**：右键菜单快速访问所有功能
- **轻量启动**：启动器窗口隐藏，通过托盘交互

## 技术架构

### 核心技术栈

| 技术 | 用途 |
|------|------|
| **Tauri v2** | 跨平台桌面应用框架，Rust 后端 |
| **SolidJS** | 响应式前端框架，高性能 UI |
| **TypeScript** | 类型安全的 JavaScript 超集 |
| **Tailwind CSS** | 实用优先的 CSS 框架 |
| **Vite** | 快速的前端构建工具 |

### 架构亮点

#### 1. 多窗口独立架构

LazyTrans 采用独特的多窗口设计，每个功能模块作为独立窗口运行：

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   translator    │  │    settings     │  │   screenshot    │
│   悬浮翻译窗口   │  │    设置窗口     │  │   截图翻译窗口   │
│  (透明/无边框)   │  │   (常规窗口)    │  │  (全屏遮罩)     │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                    ┌─────────────────┐
                    │     daemon      │
                    │   后台服务窗口   │
                    │  (隐藏/托盘管理) │
                    └─────────────────┘
```

#### 2. Type-Safe 窗口标签系统

基于 TypeScript 的类型安全窗口管理：

```typescript
// 窗口标签类型，编译时检查
type WindowLabel = "translator" | "settings" | "screenshot";

// 统一窗口配置
const WINDOW_CONFIG: Record<WindowLabel, WindowConfig> = {
  translator: { /* 无边框、透明、置顶 */ },
  settings: { /* 常规窗口 */ },
  screenshot: { /* 全屏、透明 */ },
};
```

#### 3. 动态窗口创建

窗口不在 `tauri.conf.json` 中静态定义，而是通过 JavaScript API 动态创建：

```typescript
import { showWindow, toggleWindow } from "./utils/window";

// 显示窗口（不存在则自动创建）
await showWindow("translator");

// 切换窗口显示状态
await toggleWindow("settings");
```

#### 4. 权限安全模型

基于 Tauri v2 的 Capabilities 系统，精细化控制权限：

```json
{
  "windows": ["daemon", "settings", "screenshot", "translator"],
  "permissions": [
    "core:window:allow-show",
    "core:window:allow-hide",
    "core:webview:allow-create-webview-window"
  ]
}
```

## 快速开始

### 环境要求

- [Node.js](https://nodejs.org/) (v18+)
- [Bun](https://bun.sh/) (推荐) 或 npm/yarn/pnpm
- [Rust](https://www.rust-lang.org/) (最新稳定版)

### 安装步骤

1. **克隆仓库**

```bash
git clone https://github.com/lazyTrans/lazyTrans.git
cd lazyTrans
```

2. **安装依赖**

```bash
# 前端依赖
bun install

# Rust 依赖（首次运行会自动安装）
```

3. **启动开发服务器**

```bash
bun run tauri dev
```

应用将自动启动，系统托盘会出现 LazyTrans 图标。

## 开发指南

### 常用命令

```bash
# 启动开发服务器
bun run dev
bun run tauri dev

# 构建生产版本
bun run build
bun run tauri build

# 类型检查
bun run check

# 代码格式化
bun run fix
```

### 项目结构

```
lazyTrans/
├── src/                          # 前端源代码
│   ├── config/
│   │   └── window.config.ts      # 窗口配置定义
│   ├── utils/
│   │   └── window.ts             # 窗口管理工具函数
│   ├── windows/                  # 各窗口独立入口
│   │   ├── translator/           # 翻译窗口
│   │   │   └── index.tsx
│   │   ├── settings/             # 设置窗口
│   │   │   ├── index.tsx         # 设置应用根组件
│   │   │   ├── layout.tsx        # 设置页面布局
│   │   │   ├── routes.ts         # 路由配置
│   │   │   └── pages/            # 设置子页面
│   │   │       ├── general.tsx   # 通用设置
│   │   │       ├── appearance.tsx # 外观设置
│   │   │       ├── shortcuts.tsx # 快捷键设置
│   │   │       ├── language.tsx  # 语言设置
│   │   │       └── about.tsx     # 关于页面
│   │   └── screenshot/           # 截图窗口
│   │       └── index.tsx
│   ├── tray.ts                   # 系统托盘管理
│   ├── index.tsx                 # 应用入口（窗口路由）
│   └── index.css                 # 全局样式
├── src-tauri/                    # Tauri/Rust 后端
│   ├── src/
│   │   ├── lib.rs                # Tauri 命令定义
│   │   └── main.rs               # 应用入口
│   ├── capabilities/
│   │   └── default.json          # 权限配置
│   └── tauri.conf.json           # Tauri 配置
├── package.json                  # 前端依赖
└── vite.config.ts                # Vite 配置
```

### 添加新窗口

1. 在 `src/config/window.config.ts` 添加窗口配置
2. 在 `src/windows/` 创建窗口组件目录
3. 在 `src/index.tsx` 注册窗口组件
4. 更新 `src-tauri/capabilities/default.json` 添加窗口权限

## 构建和发布

### 开发构建

```bash
bun run tauri dev
```

### 生产构建

```bash
# 构建所有平台的安装包
bun run tauri build

# 构建结果位于：
# src-tauri/target/release/bundle/
```

### 支持平台

- macOS (Intel & Apple Silicon)
- Windows
- Linux (开发中)

## 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

### 代码规范

- 使用 Biome 进行代码格式化和检查
- 提交前运行 `bun run check-fix`
- 遵循 Husky pre-commit 钩子

## 许可证

[MIT](LICENSE)

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=lazyTrans/lazyTrans&type=Date)](https://star-history.com/#lazyTrans/lazyTrans&Date)

---

<p align="center">
  用 ❤️ 和 ☕ 构建
</p>
