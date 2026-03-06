import type { TranslateProvider } from "@/services/translate/types";

export interface TranslateResultItem {
  error: string | null;
  isCollapsed: boolean;
  loading: boolean;
  provider: TranslateProvider;
  resultLines: string[];
}
