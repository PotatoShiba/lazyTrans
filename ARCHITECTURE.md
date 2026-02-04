# 项目架构说明

## 重构后的架构

本次重构将设置窗口从路由模式改为独立窗口模式，使用 Tauri 的 `Window` API 动态创建。

## 文件结构

```
src/
├── app.tsx                     # 主窗口组件（简化版）
├── index.tsx                   # 应用入口
├── index.css                   # 全局样式
├── tray.ts                     # 托盘管理
├── vite-env.d.ts
├── hooks/
│   └── useWindow.ts           # 窗口管理 Hooks
├── utils/
│   └── window.ts              # 窗口管理工具函数
└── windows/                   # 窗口目录
    ├── main/                  # 主窗口
    │   ├── MainApp.tsx
    │   └── index.tsx          # 主窗口入口
    ├── settings/              # 设置窗口
    │   ├── index.tsx          # 设置窗口入口
    │   ├── SettingsApp.tsx    # 设置应用根组件
    │   ├── SettingsLayout.tsx # 设置布局
    │   ├── routes.ts          # 设置路由配置
    │   └── pages/             # 设置页面
    │       ├── GeneralSettings.tsx
    │       ├── AppearanceSettings.tsx
    │       ├── ShortcutsSettings.tsx
    │       ├── LanguageSettings.tsx
    │       └── AboutSettings.tsx
    └── screenshot/            # 截图窗口（预留）

src-tauri/
├── src/
│   ├── lib.rs                 # Tauri 命令
│   └── main.rs
├── capabilities/
│   └── default.json           # 权限配置
└── tauri.conf.json            # Tauri 配置
```

## 核心变更

### 1. 窗口管理

使用 `src/utils/window.ts` 统一管理窗口：

```typescript
// 窗口标签
type WindowLabel = "main" | "settings" | "screenshot" | "translator";

// 显示窗口
await showWindow("settings");

// 隐藏窗口
await hideWindow("translator");

// 关闭窗口
await closeWindow("screenshot");
```

### 2. 设置窗口

- 从路由模式改为独立窗口
- 通过 `Window` API 动态创建
- 保留原有设置页面和布局

### 3. 托盘菜单

更新托盘菜单项：
- 翻译 - 唤起翻译窗口
- 截图翻译 - 唤起截图窗口
- 设置 - 唤起设置窗口
- 退出

### 4. 权限配置

更新 `capabilities/default.json`，为所有窗口添加权限：
- `core:window:allow-show`
- `core:window:allow-hide`
- `core:window:allow-close`
- `core:window:allow-create`
- 等窗口操作权限

## 使用方式

### 创建并显示设置窗口

```typescript
import { showWindow } from "./utils/window";

// 在任何地方调用
await showWindow("settings");
```

### 在组件中使用窗口 Hook

```typescript
import { useWindow } from "./hooks/useWindow";

function MyComponent() {
  const { show, hide, close } = useWindow("translator");
  
  return (
    <button onClick={show}>显示翻译窗口</button>
  );
}
```

### 操作当前窗口

```typescript
import { useCurrentWindow } from "./hooks/useWindow";

function MyComponent() {
  const { minimize, maximize, close, hide } = useCurrentWindow();
  
  return (
    <button onClick={close}>关闭当前窗口</button>
  );
}
```

## 下一步开发

### 1. 翻译浮动窗口 (translator)

创建 `src/windows/translator/` 目录：
- 无边框、置顶显示
- 支持文本输入和翻译结果展示
- 可拖动、可调整大小

### 2. OCR 截图窗口 (screenshot)

创建 `src/windows/screenshot/` 目录：
- 全屏遮罩
- 区域选择
- 截图后触发 OCR

### 3. 全局快捷键

在 `src-tauri/src/lib.rs` 添加快捷键注册命令

## 注意事项

1. 设置窗口现在通过 JavaScript API 动态创建，而非在 `tauri.conf.json` 中静态定义
2. 每个窗口类型都有独立的配置（尺寸、装饰、层级等）
3. 窗口通过标签（label）进行标识和管理
4. 确保 `capabilities/default.json` 中包含所有需要的窗口权限
