import { listen, type UnlistenFn } from "@tauri-apps/api/event";
import hotkeys from "hotkeys-js";
import { createSignal, onCleanup, onMount } from "solid-js";
import {
  getDefaultKeyMap,
  getWindowShortcutMetas,
} from "../config/shortcuts.config";
import type { WindowLabel } from "../config/window.config";
import { initSettings } from "../stores/settings";
import {
  loadShortcutKeysFromStore,
  SHORTCUTS_CHANGED_EVENT,
} from "../stores/settings/shortcuts.store";

type ShortcutActionMap = Record<string, () => void | Promise<void>>;

hotkeys.filter = () => true;

export function useWindowShortcuts(
  windowLabel: WindowLabel,
  actions: ShortcutActionMap
) {
  const [keyMap, setKeyMap] = createSignal(getDefaultKeyMap());
  let unlisten: UnlistenFn | undefined;
  const scope = `window-${windowLabel}`;

  const metas = getWindowShortcutMetas(windowLabel);
  const activeMetas = metas.filter((meta) => actions[meta.id]);

  function bindKeys() {
    hotkeys.deleteScope(scope);
    const keys = keyMap();

    for (const meta of activeMetas) {
      const combo = keys[meta.id] || meta.defaultKey;
      hotkeys(combo, { scope }, (e) => {
        e.preventDefault();
        e.stopPropagation();
        Promise.resolve(actions[meta.id]()).catch(console.error);
      });
    }

    hotkeys.setScope(scope);
  }

  const reloadKeys = async () => {
    const keys = await loadShortcutKeysFromStore();
    setKeyMap(keys);
    bindKeys();
  };

  onMount(async () => {
    await initSettings();
    await reloadKeys();
    unlisten = await listen(SHORTCUTS_CHANGED_EVENT, () => {
      reloadKeys().catch(console.error);
    });
  });

  onCleanup(() => {
    hotkeys.deleteScope(scope);
    unlisten?.();
  });
}
