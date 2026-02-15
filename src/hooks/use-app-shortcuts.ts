import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { createEffect, onCleanup, onMount } from "solid-js";
import { getGlobalShortcutMetas } from "../config/shortcuts.config";
import { initSettingsStore } from "../stores/settings";
import { shortcutsStore } from "../stores/settings/shortcuts.store";

type ShortcutActionMap = Record<string, () => void | Promise<void>>;

async function registerAllGlobalShortcuts(
  keys: Record<string, string>,
  actions: ShortcutActionMap
) {
  await unregisterAll();

  for (const meta of getGlobalShortcutMetas()) {
    const action = actions[meta.id];
    if (!action) {
      continue;
    }

    const key = keys[meta.id] || meta.defaultKey;
    try {
      await register(key, (e) => {
        if (e.state === "Pressed") {
          Promise.resolve(action()).catch(console.error);
        }
      });
    } catch (error) {
      console.error(`[Shortcuts] 注册失败: ${key}`, error);
    }
  }
}

export function useAppShortcuts(actions: ShortcutActionMap) {
  onMount(async () => {
    await initSettingsStore();
  });

  createEffect(() => {
    const keys = shortcutsStore.getAllShortcutKeys();
    registerAllGlobalShortcuts(keys, actions).catch(console.error);
  });

  onCleanup(() => {
    unregisterAll();
  });
}
