import type { Store } from "@tauri-apps/plugin-store";
import { createSignal } from "solid-js";
import type { Locale } from "../../i18n/types";
import type { SettingsModule } from "./base";

type GeneralSettings = {
  locale: Locale;
};

const DEFAULT_LOCALE: Locale = "zh-CN";

const [getLocale, setLocaleSignal] = createSignal<Locale>(DEFAULT_LOCALE);

class GeneralStore implements SettingsModule {
  private store: Store | null = null;
  private readonly STORE_KEY = "general";

  async load(store: Store) {
    this.store = store;
    const saved = await store.get<GeneralSettings>(this.STORE_KEY);
    if (saved?.locale) {
      setLocaleSignal(saved.locale);
    }
  }

  subscribe(store: Store) {
    store.onKeyChange<GeneralSettings>(this.STORE_KEY, (newValue) => {
      if (newValue?.locale) {
        setLocaleSignal(newValue.locale);
      }
    });
  }

  getLocale = () => getLocale();

  setLocale = async (locale: Locale) => {
    setLocaleSignal(locale);
    await this.persist();
  };

  private async persist() {
    const data: GeneralSettings = { locale: getLocale() };
    await this.store?.set(this.STORE_KEY, data);
  }
}

export const generalStore = new GeneralStore();
