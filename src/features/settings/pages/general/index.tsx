import { Switch } from "@/components/ui/switch";
import { useI18n } from "../../../../i18n";
import { LanguageSelect } from "./components/language-select";
import { ThemeSelect } from "./components/theme-select";

function GeneralSettings() {
  const { t } = useI18n();

  return (
    <div>
      <div class="space-y-6">
        <section class="space-y-4 rounded-lg border p-6">
          <div class="flex items-center justify-between">
            <span class="cursor-pointer pt-2">
              {t("settings.general.autoStart")}
            </span>

            <Switch />
          </div>

          <div class="flex items-start justify-between">
            <span class="cursor-pointer pt-2">
              {t("settings.general.displayLanguage")}
            </span>

            <LanguageSelect />
          </div>

          <div class="flex items-start justify-between">
            <span class="cursor-pointer pt-2">
              {t("settings.general.systemTheme")}
            </span>

            <ThemeSelect />
          </div>
        </section>
      </div>
    </div>
  );
}

export default GeneralSettings;
