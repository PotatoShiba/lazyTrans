import { useI18n } from "../../../i18n";

function AboutSettings() {
  const { t } = useI18n();

  return (
    <div>
      <h2 class="mb-6 font-bold text-2xl text-gray-800 dark:text-white">
        {t("settings.about.title")}
      </h2>

      <div class="rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-6 flex items-center">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-2xl text-white">
            T
          </div>
          <div class="ml-4">
            <h3 class="font-bold text-gray-800 text-xl dark:text-white">
              {t("common.appName")}
            </h3>
            <p class="text-gray-500 dark:text-gray-400">
              {t("common.version", { version: "0.1.0" })}
            </p>
          </div>
        </div>

        <p class="mb-6 text-gray-600 dark:text-gray-300">
          {t("settings.about.description")}
        </p>

        <div class="space-y-2 text-gray-600 text-sm dark:text-gray-400">
          <div class="flex">
            <span class="w-24 text-gray-500 dark:text-gray-500">
              {t("settings.about.developer")}
            </span>
            <span>maobai</span>
          </div>
          <div class="flex">
            <span class="w-24 text-gray-500 dark:text-gray-500">
              {t("settings.about.license")}
            </span>
            <span>MIT</span>
          </div>
          <div class="flex">
            <span class="w-24 text-gray-500 dark:text-gray-500">
              {t("settings.about.techStack")}
            </span>
            <span>Tauri + SolidJS + TypeScript</span>
          </div>
        </div>

        <div class="mt-8 border-gray-200 border-t pt-6 dark:border-gray-700">
          <div class="flex gap-4">
            <button
              class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white transition-colors hover:bg-blue-700"
              type="button"
            >
              {t("settings.about.checkUpdate")}
            </button>
            <button
              class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              type="button"
            >
              {t("settings.about.sourceCode")}
            </button>
            <button
              class="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              type="button"
            >
              {t("settings.about.feedback")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutSettings;
