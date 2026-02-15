import type { Store } from "@tauri-apps/plugin-store";
import { createSignal } from "solid-js";
import {
  getDefaultKeyMap,
  SHORTCUT_METAS,
  type ShortcutMeta,
} from "../../config/shortcuts.config";
import { isMac } from "../../utils/platform";
import type { SettingsModule } from "./base";

type ShortcutKeyMap = Record<string, string>;

const [getShortcutKeys, setShortcutKeys] = createSignal<ShortcutKeyMap>({});

function migrateKey(key: string): string {
  return key
    .replace(/\bCommandOrControl\b/gi, isMac ? "command" : "ctrl")
    .replace(/\bControl\b/g, "ctrl")
    .replace(/\bShift\b/g, "shift")
    .replace(/\bAlt\b/g, "alt")
    .toLowerCase();
}

function migrateKeyMap(map: ShortcutKeyMap): ShortcutKeyMap {
  const migrated: ShortcutKeyMap = {};
  let changed = false;
  for (const [id, key] of Object.entries(map)) {
    const newKey = migrateKey(key);
    if (newKey !== key) {
      changed = true;
    }
    migrated[id] = newKey;
  }
  return changed ? migrated : map;
}

class ShortcutsStore implements SettingsModule {
  private store: Store | null = null;
  private readonly STORE_KEY = "shortcuts";

  async load(store: Store) {
    this.store = store;
    const saved = await store.get<ShortcutKeyMap>(this.STORE_KEY);
    const defaults = getDefaultKeyMap();
    const merged = { ...defaults, ...(saved || {}) };
    const migrated = migrateKeyMap(merged);
    setShortcutKeys(migrated);
    if (migrated !== merged) {
      await store.set(this.STORE_KEY, migrated);
    }
  }

  subscribe(store: Store) {
    store.onKeyChange<ShortcutKeyMap>(this.STORE_KEY, (newValue) => {
      if (newValue) {
        setShortcutKeys(newValue);
      }
    });
  }

  getAllShortcutKeys = () => getShortcutKeys();

  getShortcutKey = (id: string) => getShortcutKeys()[id];

  updateShortcut = async (id: string, key: string) => {
    const newMap = { ...getShortcutKeys(), [id]: key };
    setShortcutKeys(newMap);
    await this.store?.set(this.STORE_KEY, newMap);
  };

  resetShortcuts = async () => {
    const defaults = getDefaultKeyMap();
    setShortcutKeys(defaults);
    await this.store?.set(this.STORE_KEY, defaults);
  };

  getShortcuts = (): (ShortcutMeta & { currentKey: string })[] => {
    const keys = getShortcutKeys();
    return SHORTCUT_METAS.map((meta) => ({
      ...meta,
      currentKey: keys[meta.id] || meta.defaultKey,
    }));
  };
}

export const shortcutsStore = new ShortcutsStore();
