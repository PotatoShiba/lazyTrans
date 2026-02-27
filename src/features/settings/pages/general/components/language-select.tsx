import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import type { Locale } from "../../../../../i18n";
import {
  generalActions,
  generalStore,
} from "../../../../../stores/settings/general.store";

const LANGUAGES: { code: Locale; name: string; flag: string }[] = [
  { code: "zh-CN", name: "简体中文", flag: "🇨🇳" },
  { code: "en_US", name: "English", flag: "🇺🇸" },
];

export function LanguageSelect() {
  return (
    <Select
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          {props.item.rawValue.flag} {props.item.rawValue.name}
        </SelectItem>
      )}
      onChange={(val) => val && generalActions.update({ locale: val.code })}
      options={LANGUAGES}
      optionTextValue="name"
      optionValue="code"
      value={LANGUAGES.find((l) => l.code === generalStore.locale)}
    >
      <SelectTrigger>
        <SelectValue<(typeof LANGUAGES)[0]>>
          {(state) => (
            <>
              {state.selectedOption()?.flag} {state.selectedOption()?.name}
            </>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  );
}
