# LazyTrans - Agent 开发手册
> 给进入本仓库执行任务的 AI coding agents 使用；优先遵循本文件，其次遵循仓库脚本与配置。

## 1) 项目概览
- 类型：Tauri v2 + SolidJS 桌面翻译应用（Monorepo）
- 包管理：`bun@1.3.10`
- 任务编排：`turbo`
- 代码规范：Biome（root / desktop 使用 `ultracite`）
- 语言：TypeScript（strict）

```text
lazyTrans/
├── apps/desktop/              # Tauri 前端应用
├── packages/translate-core/   # 翻译核心库
├── package.json               # monorepo 根脚本
├── turbo.json                 # turbo 任务图
├── biome.jsonc                # 代码规范配置
└── tsconfig.base.json         # TS 基础配置
```

---

## 2) 构建 / 检查 / 测试命令
### 2.1 根目录（推荐入口）
- `bun install`
- `bun run dev`
- `bun run build`
- `bun run typecheck` / `bun run check`
- `bun run lint`
- `bun run fix` / `bun run check-fix`
- `bun run test`
- `bun run clean`

脚本来源：`package.json`
- `dev`: `bunx turbo run dev --filter=@lazytrans/desktop`
- `build`: `bunx turbo run build`
- `typecheck`: `bunx turbo run typecheck`
- `lint`: `bunx ultracite check .`
- `fix`: `bunx ultracite fix`
- `test`: `bunx turbo run test`

### 2.2 Desktop（`apps/desktop`）
- `bun run dev`
- `bun run tauri:dev`
- `bun run tauri:build`
- `bun run typecheck`
- `bun run lint`
- `bun run fix`
- `bun run test`

### 2.3 Translate Core（`packages/translate-core`）
- `bun run dev`
- `bun run build`
- `bun run typecheck`
- `bun run lint`
- `bun run test`
- `bun run clean`

### 2.4 单测（重点）
```bash
bun test <file-path>
bun test --grep "<pattern>"
```
示例：`bun test src/utils/window.test.ts`、`bun test --grep "window"`
说明：当前仓库几乎没有已提交测试文件（未检索到 `.test.ts/.spec.ts`）。

---

## 3) 代码风格与约定
### 3.1 TypeScript 基线（`tsconfig.base.json`）
- `strict: true`
- `target: ES2022`
- `module: ESNext`
- `moduleResolution: Bundler`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`
- 不要用 `any`、`@ts-ignore`、`@ts-expect-error` 绕过类型系统

### 3.2 导入与模块
参考：`apps/desktop/src/index.tsx`、`apps/desktop/src/stores/settings/base.ts`、`apps/desktop/src/components/ui/button.tsx`
- 使用命名导入为主
- `import type { ... }` 与值导入分离
- 组顺序：第三方 -> 本地模块 -> 样式导入
- Desktop 优先路径别名 `@/*`（见 `apps/desktop/tsconfig.json`）
- 允许 `import * as X`（Biome `noNamespaceImport` 已关闭）

### 3.3 命名规范
- 组件/类/类型：`PascalCase`
- 函数/变量：`camelCase`
- Hook：`useXxx`
- 常量：`UPPER_SNAKE_CASE`
- Provider 类名建议后缀：`OpenAITranslateProvider`

### 3.4 SolidJS 习惯用法
- 局部状态：`createSignal`
- 结构化状态：`createStore` + `produce` + `reconcile`
- 副作用：`createEffect` + `onCleanup`
- 事件名：`onClick` / `onInput` / `onPointerDown`

### 3.5 异步与错误处理
参考：`apps/desktop/src/utils/window.ts`、`apps/desktop/src/index.tsx`、`packages/translate-core/src/translate/providers/openai.ts`
- 关键路径：`try/catch` + 带上下文 `console.error`
- 非关键 UI 操作允许静默失败：`.catch(() => undefined)`
- 网络/Provider 失败需抛出明确错误（含状态码与响应文本）
- 不要写空 `catch {}`（除非明确“有意忽略”并写注释）

### 3.6 格式化与 lint（`biome.jsonc`）
- 继承：`ultracite/biome/core` + `ultracite/biome/solid`
- `noNamespaceImport`: off
- `noBarrelFile`: off
- `useConsistentTypeDefinitions`: off（允许 `type` 与 `interface` 共存）
建议提交前至少运行：`bun run check-fix`

---

## 4) 架构与实现约束
- 多窗口架构：`apps/desktop/src/config/window.config.ts`
- 设置持久化：`@tauri-apps/plugin-store` + `solid-js/store`
- 翻译核心：Provider Registry（`packages/translate-core/src/core/*`）
- 内部依赖使用 workspace：`"@lazytrans/translate-core": "workspace:*"`
- 改动原则：小步、局部、可验证；Bugfix 避免顺手大重构

---

## 5) Git 与提交前检查
- Husky pre-commit：`.husky/pre-commit`
- 钩子会对暂存文件执行 `bun check-fix`，并自动重新 `git add`
- 若提交失败，先按提示修复类型/格式问题再提交
常用：`bun run check-fix`

---

## 6) Cursor / Copilot 规则状态
已检查：`.cursor/rules/`、`.cursorrules`、`.github/copilot-instructions.md`
结论：当前仓库未发现上述规则文件。

---

## 7) Agent 执行建议（简版）
- 先读脚本与配置再动代码
- 优先复用现有模式（store/provider/window utils）
- 仅改必要文件，避免无关格式化噪音
- 完成后至少验证：`bun run check`、`bun run lint`、`bun run test`（若改动影响测试路径）

## 8) 快速排错提示
- `bun run check` 失败：优先修 TS 错误，再跑 `bun run check-fix`
- `bun run lint` 失败：先在变更文件范围内修复，避免全仓无关改动
- 提交被钩子拦截：按钩子输出修复后重新 `git add` 与 `git commit`
