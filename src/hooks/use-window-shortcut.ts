import { onCleanup, onMount } from "solid-js";

type WindowShortcutEntry = {
  key: string;
  metaKey: boolean;
  handler: () => void;
};

export function useWindowShortcut(shortcut: WindowShortcutEntry) {
  const handleKeyDown = (e: KeyboardEvent) => {
    const modifier = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();

    if (shortcut.metaKey && modifier && key === shortcut.key) {
      e.preventDefault();
      e.stopPropagation();
      shortcut.handler();
    }
  };

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown, { capture: true });
  });

  onCleanup(() => {
    document.removeEventListener("keydown", handleKeyDown, { capture: true });
  });
}
