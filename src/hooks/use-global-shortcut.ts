import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { register, unregisterAll } from "@tauri-apps/plugin-global-shortcut";
import { onCleanup, onMount } from "solid-js";
import { openSettings, openTranslator } from "../actions/window";
import { hideWindow } from "../utils/window";

/** 应用内快捷键（仅窗口聚焦时生效） */
type AppShortcutEntry = {
  key: string;
  metaKey: boolean;
  handler: () => void;
};

const appShortcuts: AppShortcutEntry[] = [
  {
    key: ",",
    metaKey: true,
    handler: () => openSettings(),
  },
  {
    key: "w",
    metaKey: true,
    handler: () => hideWindow(),
  },
];

/** 系统全局快捷键（无论应用是否聚焦都生效） */
type GlobalShortcutEntry = {
  shortcut: string;
  handler: () => void;
};

const globalShortcuts: GlobalShortcutEntry[] = [
  {
    shortcut: "CmdOrCtrl+.",
    handler: () => openTranslator(),
  },
];

export function useGlobalShortcut() {
  const handleKeyDown = (e: KeyboardEvent) => {
    const modifier = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();

    for (const shortcut of appShortcuts) {
      if (shortcut.metaKey && modifier && key === shortcut.key) {
        e.preventDefault();
        e.stopPropagation();
        shortcut.handler();
      }
    }
  };

  const registerGlobalShortcuts = async () => {
    for (const { shortcut, handler } of globalShortcuts) {
      await register(shortcut, (event) => {
        if (event.state === "Pressed") {
          handler();
        }
      });
    }
  };

  let unlistenCloseRequested: Promise<() => void> | undefined;

  onMount(() => {
    const currentWindow = getCurrentWebviewWindow();
    unlistenCloseRequested = currentWindow.onCloseRequested(
      (event: { preventDefault: () => void }) => {
        event.preventDefault();
        hideWindow();
      }
    );

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    registerGlobalShortcuts();
  });

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown, { capture: true });

    unlistenCloseRequested
      ?.then((unlisten) => unlisten())
      .catch(() => undefined);

    unregisterAll();
  });
}
