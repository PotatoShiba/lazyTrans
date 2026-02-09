import { exit } from "@tauri-apps/plugin-process";
import { hideAllWindows, setAlwaysOnTop, showWindow } from "../utils/window";

export async function openSettings() {
  await hideAllWindows();
  showWindow("settings");
}

export function openTranslator() {
  showWindow("translator");
}

export function pinTranslator(pinned: boolean) {
  setAlwaysOnTop(pinned, "translator");
}

export function quitApp() {
  exit(0);
}
