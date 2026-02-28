import type { Dictionary } from "../i18n";
import { isMac } from "../utils/platform";
import type { WindowLabel } from "./window.config";

export type ShortcutMeta = {
  id: string;
  labelKey: keyof Dictionary & `shortcuts.${string}`;
  defaultKey: string;
  category: "global" | "internal";
  windows?: WindowLabel[];
};

/** 跨平台修饰键：macOS 用 command，其他平台用 ctrl */
const MOD = isMac ? "command" : "ctrl";

export const SHORTCUT_METAS: ShortcutMeta[] = [
  {
    id: "translate",
    labelKey: "shortcuts.translate",
    defaultKey: `${MOD}+.`,
    category: "global",
  },
  {
    id: "window.hide",
    labelKey: "shortcuts.hideWindow",
    defaultKey: `${MOD}+w`,
    category: "internal",
    windows: ["translator", "settings"],
  },
  {
    id: "translator.togglePinned",
    labelKey: "shortcuts.togglePinned",
    defaultKey: `${MOD}+p`,
    category: "internal",
    windows: ["translator"],
  },
  {
    id: "app.openSettings",
    labelKey: "shortcuts.openSettings",
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
