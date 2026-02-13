import type { FileRouteTypes } from "../../routeTree.gen";

type RouteTo = FileRouteTypes["to"];

export type SettingsMenuItem = {
  id: string;
  label: string;
  to: RouteTo;
  icon: string;
};

export const settingsMenuItems: SettingsMenuItem[] = [
  {
    id: "general",
    icon: "icon-[tabler--settings]",
    label: "通用",
    to: "/settings",
  },
  {
    id: "shortcuts",
    icon: "icon-[tabler--keyboard]",
    label: "快捷键",
    to: "/settings/shortcuts",
  },
  {
    id: "language",
    icon: "icon-[tabler--language]",
    label: "语言",
    to: "/settings/language",
  },
  {
    id: "about",
    icon: "icon-[tabler--info-circle]",
    label: "关于",
    to: "/settings/about",
  },
];
