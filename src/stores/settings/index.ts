import { getStore, type SettingsModule } from "./base";
import { generalStore } from "./general.store";
import { shortcutsStore } from "./shortcuts.store";

const modules: SettingsModule[] = [generalStore, shortcutsStore];

let loaded = false;

export async function initSettingsStore() {
  if (loaded) {
    return;
  }
  const store = await getStore();
  await Promise.all(modules.map((m) => m.load(store)));
  for (const m of modules) {
    m.subscribe(store);
  }
  loaded = true;
}
