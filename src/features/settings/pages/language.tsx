import { Link } from "@tanstack/solid-router";
import { useI18n } from "../../../i18n";

function LanguageSettings() {
  const { t } = useI18n();

  return (
    <div>
      <h2 class="mb-6 font-bold text-2xl text-gray-800 dark:text-white">
        {t("settings.language.title")}
      </h2>

      <section class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 class="mb-2 font-semibold text-gray-800 text-lg dark:text-white">
          {t("settings.general.displayLanguage")}
        </h3>

        <p class="text-gray-600 text-sm dark:text-gray-300">
          该设置已迁移到“通用”页面。
        </p>

        <div class="mt-4">
          <Link
            class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-sm text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            to="/settings"
          >
            前往通用设置
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LanguageSettings;
