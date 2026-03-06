# 手动展开触发翻译 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**目标:** 当用户手动展开已折叠的翻译服务项时，触发该服务执行一次翻译（仅被展开的服务，不重复触发其他服务）

**架构:** 在 `useMultiTranslate` 中新增 `triggerProviderTranslation(provider)` 方法，暴露给组件；`TranslateResultList` 在 Accordion onChange 中检测由折叠→展开的变化，调用该方法触发单个服务翻译。

**技术栈:** SolidJS, TypeScript, 手风琴组件 (Accordion)

---

## 任务依赖图

| 任务 | 依赖 | 原因 |
|------|------|------|
| Task 1 | None | 基础类型定义，无前置依赖 |
| Task 2 | Task 1 | useMultiTranslate 需要使用 Task 1 中定义的翻译记录类型 |
| Task 3 | Task 2 | TranslateResultList 需要调用 Task 2 中新增的 triggerProviderTranslation 方法 |

## 并行执行图

Wave 1 (立即执行):
- Task 1: 类型定义与常量

Wave 2 (Task 1 完成后):
- Task 2: useMultiTranslate 新增单个服务触发方法

Wave 3 (Task 2 完成后):
- Task 3: TranslateResultList 集成展开检测与触发

关键路径: Task 1 → Task 2 → Task 3

---

## Task 1: 添加翻译记录追踪类型

**文件:**
- 修改: `apps/desktop/src/features/translator/hooks/useMultiTranslate.ts:1-10`

**步骤:**

**步骤 1: 在 useMultiTranslate.ts 顶部添加已翻译服务记录**

```typescript
// 在原有导入语句后，添加类型定义
// 追踪已翻译的服务（防止重复触发）
interface TranslatedProvidersState {
  text: string;
  providers: Set<string>;
}
```

**步骤 2: 在 useMultiTranslate 函数内添加信号**

在 `createEffect` 之前添加：

```typescript
// 记录已触发过翻译的服务（按文本内容区分）
const [translatedProviders, setTranslatedProviders] = createSignal<TranslatedProvidersState>({
  text: "",
  providers: new Set(),
});
```

**步骤 3: 在文本变化时重置翻译记录**

在监听 `text()` 的 `createEffect` 中（约第 177 行），当文本变化时清空记录：

```typescript
createEffect(() => {
  const currentText = text().trim();
  const runVersion = ++activeRunVersion;

  // 文本变化时重置翻译记录
  if (currentText !== translatedProviders().text) {
    setTranslatedProviders({ text: currentText, providers: new Set() });
  }

  if (!currentText) {
    setIsAnyLoading(false);
    return;
  }

  setIsAnyLoading(true);
  executeTranslation(currentText, runVersion).catch((error) => {
    if (runVersion !== activeRunVersion) {
      return;
    }

    setResults([]);
    setIsAnyLoading(false);
    console.error("[translate] 初始化或执行失败", error);
  });
});
```

**步骤 4: 在 executeTranslation 中标记已翻译服务**

在 `executeTranslation` 函数中，当翻译成功或失败时，将该服务标记为已翻译：

找到 `Promise.allSettled(promises).then()` 块（约第 169-175 行），改为：

```typescript
Promise.allSettled(promises).then((results) => {
  if (runVersion !== activeRunVersion) {
    return;
  }
  
  // 标记已翻译的服务
  const translated = new Set<string>();
  for (let i = 0; i < results.length; i++) {
    if (!isProviderManuallyCollapsed(allProviders[i])) {
      translated.add(allProviders[i].provider);
    }
  }
  setTranslatedProviders(prev => ({
    text: textSnapshot,
    providers: new Set([...prev.providers, ...translated]),
  }));
  
  setIsAnyLoading(false);
});
```

**验证:**
- 类型检查通过: `cd apps/desktop && bun run check`

**步骤 5: 提交**

```bash
git add apps/desktop/src/features/translator/hooks/useMultiTranslate.ts
git commit -m "feat: add translation tracking for manual trigger"
```

---

## Task 2: useMultiTranslate 新增单个服务触发方法

**文件:**
- 修改: `apps/desktop/src/features/translator/hooks/useMultiTranslate.ts:210-220`

**步骤:**

**步骤 1: 在 useMultiTranslate 中新增 triggerProviderTranslation 函数**

在 `executeTranslation` 函数后（约第 175 行后），添加新方法：

```typescript
/**
 * 触发单个服务的翻译（用于手动展开时）
 * 仅当该服务尚未翻译过当前文本时触发
 */
const triggerProviderTranslation = async (providerName: string) => {
  const currentText = text().trim();
  if (!currentText) {
    return;
  }

  // 检查该服务是否已翻译过当前文本
  if (translatedProviders().text === currentText && 
      translatedProviders().providers.has(providerName)) {
    return; // 已翻译过，跳过
  }

  const providers = enabledProviders();
  const providerConfig = providers.find(p => p.provider === providerName);
  if (!providerConfig) {
    return;
  }

  const index = providers.findIndex(p => p.provider === providerName);
  if (index === -1) {
    return;
  }

  // 标记为加载中
  applyProviderResult(index, activeRunVersion, (current) => ({
    ...current,
    loading: true,
    error: null,
  }));

  setIsAnyLoading(true);

  try {
    const translate = await getTranslateFn();
    const result = await translate(
      {
        apiKey: providerConfig.apiKey,
        apiEndpoint: providerConfig.apiEndpoint,
        model: providerConfig.model,
        promptTemplate: providerConfig.promptTemplate,
        maxTokens: providerConfig.maxTokens,
        temperature: providerConfig.temperature,
        provider: providerConfig.provider,
        sourceLang: translateConfig.sourceLang,
        targetLang: translateConfig.targetLang,
      },
      {
        text: currentText,
        sourceLang: translateConfig.sourceLang,
        targetLang: translateConfig.targetLang,
      }
    );

    applyProviderResult(index, activeRunVersion, (current) => ({
      ...current,
      resultLines: normalizeResultLines(result.text),
      error: null,
      loading: false,
    }));

    // 标记为已翻译
    setTranslatedProviders(prev => ({
      text: currentText,
      providers: new Set([...prev.providers, providerName]),
    }));
  } catch (error) {
    applyProviderResult(index, activeRunVersion, (current) => ({
      ...current,
      resultLines: [],
      error: error instanceof Error ? error.message : "Translation failed",
      loading: false,
    }));
  } finally {
    // 检查是否还有加载中的服务
    const anyLoading = results().some(r => r.loading);
    if (!anyLoading) {
      setIsAnyLoading(false);
    }
  }
};
```

**步骤 2: 在返回对象中暴露新方法**

找到 `return { ... }` 语句（约第 214 行），添加新方法：

```typescript
return {
  results,
  isAnyLoading,
  enabledProviders,
  triggerProviderTranslation, // 新增
};
```

**验证:**
- 类型检查通过: `cd apps/desktop && bun run check`

**步骤 3: 提交**

```bash
git add apps/desktop/src/features/translator/hooks/useMultiTranslate.ts
git commit -m "feat: add triggerProviderTranslation method for manual expand"
```

---

## Task 3: TranslateResultList 集成展开检测与触发

**文件:**
- 修改: `apps/desktop/src/features/translator/components/TranslateResultList.tsx:21-35`

**步骤:**

**步骤 1: 从 hook 中解构新方法**

找到 `useMultiTranslate` 调用处（约第 21 行），改为：

```typescript
const { results, enabledProviders, triggerProviderTranslation } = useMultiTranslate(() => props.text);
```

**步骤 2: 新增记录已触发过的服务集合**

在 `userInteractedProviders` 信号后（约第 29 行后），添加：

```typescript
// 记录已手动触发过翻译的服务（防止重复触发）
const [manuallyTriggeredProviders, setManuallyTriggeredProviders] = createSignal(
  new Set<TranslateResultItem["provider"]>()
);

// 文本变化时重置手动触发记录
createEffect(() => {
  props.text;
  setManuallyTriggeredProviders(new Set<TranslateResultItem["provider"]());
});
```

**步骤 3: 修改 handleAccordionChange 检测展开并触发翻译**

找到 `handleAccordionChange` 函数（约第 71 行），在更新 `userInteractedProviders` 后，添加触发翻译逻辑：

```typescript
const handleAccordionChange = (nextValue: string[] | string | undefined) => {
  const expandedSet = new Set(normalizeAccordionValues(nextValue));
  const previousExpandedSet = new Set(expandedValues());
  const currentResults = results();

  setUserInteractedProviders((prev) => {
    const next = new Set(prev);
    for (const [index, item] of currentResults.entries()) {
      const key = `translate-${index}`;
      if (previousExpandedSet.has(key) !== expandedSet.has(key)) {
        next.add(item.provider);
      }
    }
    return next;
  });

  // 检测由折叠→展开的服务，触发翻译
  for (const [index, item] of currentResults.entries()) {
    const key = `translate-${index}`;
    const wasCollapsed = !previousExpandedSet.has(key);
    const isExpanded = expandedSet.has(key);
    
    // 条件：从折叠变为展开 + 该服务尚未翻译（无结果且无错误且未加载）+ 未手动触发过
    if (wasCollapsed && isExpanded && 
        !item.loading && 
        item.resultLines.length === 0 && 
        !item.error &&
        !manuallyTriggeredProviders().has(item.provider)) {
      // 标记为已手动触发
      setManuallyTriggeredProviders(prev => new Set([...prev, item.provider]));
      // 触发该服务的翻译
      triggerProviderTranslation(item.provider);
    }
  }

  let hasChanges = false;

  const nextProviders = translateConfig.providers.map((config) => {
    const resultIndex = currentResults.findIndex(
      (item) => item.provider === config.provider
    );

    if (resultIndex === -1) {
      return config;
    }

    const shouldCollapse = !expandedSet.has(`translate-${resultIndex}`);
    if (config.isCollapsed === shouldCollapse) {
      return config;
    }

    hasChanges = true;
    return {
      ...config,
      isCollapsed: shouldCollapse,
    };
  });

  if (!hasChanges) {
    return;
  }

  translateActions.update({ providers: nextProviders });
};
```

**验证:**
- 类型检查通过: `cd apps/desktop && bun run check`

**步骤 4: 提交**

```bash
git add apps/desktop/src/features/translator/components/TranslateResultList.tsx
git commit -m "feat: trigger translation when manually expanding collapsed provider"
```

---

## Commit 策略

| Commit | 文件 | 说明 |
|--------|------|------|
| 1 | `useMultiTranslate.ts` | 添加翻译记录追踪类型与逻辑 |
| 2 | `useMultiTranslate.ts` | 新增 triggerProviderTranslation 方法 |
| 3 | `TranslateResultList.tsx` | 集成展开检测与翻译触发 |

---

## 成功标准

- [ ] 用户展开已折叠的服务时，该服务触发一次翻译
- [ ] 已翻译过的服务不会重复触发
- [ ] 保持现有自动翻译流程（输入文本时自动翻译非折叠服务）
- [ ] 无 TypeScript 类型错误
- [ ] 代码通过 Biome lint: `bun run lint`

## 回滚计划

如需回滚，按顺序撤销：
1. 撤销 Task 3: 恢复 `TranslateResultList.tsx` 到原状态
2. 撤销 Task 2: 从 `useMultiTranslate.ts` 返回对象中移除 `triggerProviderTranslation`
3. 撤销 Task 1: 从 `useMultiTranslate.ts` 移除 `translatedProviders` 相关逻辑
