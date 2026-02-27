import type { RawDictionary } from "../types";

export const dict: RawDictionary = {
  settings: {
    title: "Settings",
    menu: {
      general: "General",
      shortcuts: "Shortcuts",
      about: "About",
    },
    general: {
      autoStart: "Launch at Login",
      displayLanguage: "Display Language",
      systemTheme: "System Theme",
    },
    shortcuts: {
      globalTitle: "Global Shortcuts",
      internalTitle: "In-App Shortcuts",
      recording: "Press a shortcut...",
    },
  },
  translator: {
    settingsTooltip: "Settings, cmd+,",
    translate: "Translate",
  },
  shortcuts: {
    translate: "Translate",
    hideWindow: "Hide Window",
    togglePinned: "Toggle Pin",
    openSettings: "Open Settings",
  },
};
