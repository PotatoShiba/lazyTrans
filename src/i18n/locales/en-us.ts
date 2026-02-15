import type { RawDictionary } from "../types";

export const dict: RawDictionary = {
  common: {
    appName: "lazyTrans",
    version: "Version {{ version }}",
  },
  settings: {
    menu: {
      general: "General",
      shortcuts: "Shortcuts",
      language: "Language",
      about: "About",
    },
    general: {
      title: "General Settings",
      startup: "Startup Options",
      autoStart: "Launch at Login",
      displayLanguage: "Display Language",
      minimizeToTray: "Minimize to Tray on Start",
      translation: "Translation Settings",
      defaultTargetLang: "Default Target Language",
      autoDetectLang: "Auto Detect Language",
    },
    shortcuts: {
      globalTitle: "Global Shortcuts",
      internalTitle: "In-App Shortcuts",
      recording: "Press a shortcut...",
    },
    language: {
      title: "Language Settings",
      interfaceLang: "Interface Language",
      restartHint: "Restart the app for language changes to take effect.",
    },
    about: {
      title: "About",
      description:
        "lazyTrans is a lightweight and efficient translation tool that supports multiple translation engines to help you quickly understand and translate content in various languages.",
      developer: "Developer",
      license: "License",
      techStack: "Tech Stack",
      checkUpdate: "Check for Updates",
      sourceCode: "Source Code",
      feedback: "Report Issue",
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
