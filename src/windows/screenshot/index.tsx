import { getCurrentWindow } from "@tauri-apps/api/window";
import { onCleanup, onMount } from "solid-js";

function ScreenshotApp() {
  const currentWindow = getCurrentWindow();

  onMount(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        currentWindow.hide().catch(console.error);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      window.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <div class="flex h-screen w-screen items-center justify-center bg-black/40 text-white">
      <div class="rounded-lg bg-black/60 px-6 py-4 text-center text-sm">
        截图模式开发中，按 ESC 退出
      </div>
    </div>
  );
}

export default ScreenshotApp;
