import { isMac } from "../utils/platform";
import type { WindowLabel } from "./window.config";

export type ShortcutMeta = {
  id: string;
  label: string;
  defaultKey: string;
  category: "global" | "internal";
  windows?: WindowLabel[];
};

/** 跨平台修饰键：macOS 用 command，其他平台用 ctrl */
const MOD = isMac ? "command" : "ctrl";

export const SHORTCUT_METAS: ShortcutMeta[] = [
  {
    id: "translate",
    label: "翻译",
    defaultKey: `${MOD}+.`,
    category: "global",
  },
  {
    id: "window.hide",
    label: "隐藏窗口",
    defaultKey: `${MOD}+w`,
    category: "internal",
    windows: ["translator"],
  },
  {
    id: "translator.togglePinned",
    label: "置顶/取消置顶",
    defaultKey: `${MOD}+p`,
    category: "internal",
    windows: ["translator"],
  },
  {
    id: "app.openSettings",
    label: "打开设置",
    defaultKey: `${MOD}+,`,
    category: "internal",
    windows: ["translator"],
  },
];

/** 生成默认 keyMap */
export const getDefaultKeyMap = () =>
  Object.fromEntries(SHORTCUT_METAS.map((s) => [s.id, s.defaultKey]));

export function getWindowShortcutMetas(
  windowLabel: WindowLabel
): ShortcutMeta[] {
  return SHORTCUT_METAS.filter((s) => {
    if (s.category !== "internal") {
      return false;
    }
    if (!s.windows || s.windows.length === 0) {
      return true;
    }
    return s.windows.includes(windowLabel);
  });
}

export function getGlobalShortcutMetas(): ShortcutMeta[] {
  return SHORTCUT_METAS.filter((s) => s.category === "global");
}
