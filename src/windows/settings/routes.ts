export const settingsRoutes = {
  general: "/",
  appearance: "/appearance",
  shortcuts: "/shortcuts",
  language: "/language",
  about: "/about",
} as const;

export type SettingsRoute =
  (typeof settingsRoutes)[keyof typeof settingsRoutes];

export interface SettingsMenuItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export const settingsMenuItems: SettingsMenuItem[] = [
  { id: "general", label: "通用", path: "/" },
  { id: "appearance", label: "外观", path: "/appearance" },
  { id: "shortcuts", label: "快捷键", path: "/shortcuts" },
  { id: "language", label: "语言", path: "/language" },
  { id: "about", label: "关于", path: "/about" },
];
