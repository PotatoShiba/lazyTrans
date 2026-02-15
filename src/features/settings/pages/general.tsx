import { For } from "solid-js";
import { type Locale, useI18n } from "../../../i18n";

const LANGUAGES: { code: Locale; name: string; flag: string }[] = [
  { code: "zh-CN", name: "简体中文", flag: "🇨🇳" },
  { code: "en_US", name: "English", flag: "🇺🇸" },
];

function GeneralSettings() {
  const { t, locale, setLocale } = useI18n();

  const handleLocaleChange = (value: string) => {
    const next = LANGUAGES.find((l) => l.code === value)?.code;
    if (next) {
      setLocale(next);
    }
  };

  return (
    <div>
      <div class="space-y-6">
        <section class="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div class="flex items-center justify-between">
            <label
              class="cursor-pointer text-gray-700 dark:text-gray-300"
              for="auto-start"
            >
              {t("settings.general.autoStart")}
            </label>
            <input
              class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              id="auto-start"
              type="checkbox"
            />
          </div>

          <div class="flex items-start justify-between gap-6">
            <label
              class="cursor-pointer pt-2 text-gray-700 dark:text-gray-300"
              for="display-language"
            >
              {t("settings.general.displayLanguage")}
            </label>

            <div class="flex flex-col items-end gap-2">
              <select
                class="w-full min-w-44 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                id="display-language"
                onChange={(e) => handleLocaleChange(e.currentTarget.value)}
                value={locale()}
              >
                <For each={LANGUAGES}>
                  {(lang) => (
                    <option value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  )}
                </For>
              </select>
            </div>
          </div>
        </section>

        <section class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 class="mb-4 font-semibold text-gray-800 text-lg dark:text-white">
            {t("settings.general.translation")}
          </h3>

          <div class="space-y-4">
            <div>
              <label
                class="mb-2 block font-medium text-gray-700 text-sm dark:text-gray-300"
                for="target-lang"
              >
                {t("settings.general.defaultTargetLang")}
              </label>
              <select
                class="w-full max-w-xs rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                id="target-lang"
              >
                <option value="zh">中文</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
            </div>

            <div class="flex items-center justify-between">
              <label
                class="cursor-pointer text-gray-700 dark:text-gray-300"
                for="auto-detect"
              >
                {t("settings.general.autoDetectLang")}
              </label>
              <input
                checked
                class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                id="auto-detect"
                type="checkbox"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default GeneralSettings;
