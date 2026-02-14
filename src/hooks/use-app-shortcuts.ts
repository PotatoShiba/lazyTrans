import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { onCleanup, onMount } from "solid-js";
import { getGlobalShortcutMetas } from "../config/shortcuts.config";
import { initSettings } from "../stores/settings";
import {
  loadShortcutKeysFromStore,
  SHORTCUTS_CHANGED_EVENT,
} from "../stores/settings/shortcuts.store";

type ShortcutActionMap = Record<string, () => void | Promise<void>>;

async function registerAllGlobalShortcuts(actions: ShortcutActionMap) {
  const keys = await loadShortcutKeysFromStore();

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

async function reregisterAllGlobalShortcuts(actions: ShortcutActionMap) {
  try {
    await unregisterAll();
  } catch (e) {
    console.error("[Shortcuts] 注销全部失败", e);
  }
  await registerAllGlobalShortcuts(actions);
}

export function useAppShortcuts(actions: ShortcutActionMap) {
  let unlisten: UnlistenFn | undefined;

  onMount(async () => {
    await initSettings();
    await registerAllGlobalShortcuts(actions);

    unlisten = await listen(SHORTCUTS_CHANGED_EVENT, () => {
      reregisterAllGlobalShortcuts(actions);
    });
  });

  onCleanup(() => {
    unlisten?.();
    unregisterAll();
  });
}
