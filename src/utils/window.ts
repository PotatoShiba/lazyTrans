import { hide } from "@tauri-apps/api/app";
import {
  getCurrentWebviewWindow,
  WebviewWindow,
} from "@tauri-apps/api/webviewWindow";
import { WINDOW_CONFIG, type WindowLabel } from "../config/window.config";

async function getWindow(label?: WindowLabel) {
  if (!label) {
    return getCurrentWebviewWindow();
  }

  return await WebviewWindow.getByLabel(label);
}

function createWindow(label: WindowLabel): Promise<WebviewWindow> {
  const { label: _, ...options } = WINDOW_CONFIG[label];
  const win = new WebviewWindow(label, { ...options, visible: true });
  return new Promise((resolve, reject) => {
    win.once("tauri://created", () => resolve(win));
    win.once("tauri://error", (e) => reject(e));
  });
}

async function focusAnotherVisibleWindow(): Promise<boolean> {
  const windows = await WebviewWindow.getAll();

  for (const win of windows) {
    if (await win.isVisible()) {
      await win.show();
      await win.unminimize();
      await win.setFocus();
      return true;
    }
  }

  await hide();
  return false;
}

export function showWindow(label?: WindowLabel) {
  getOrCreateWindow(label)
    .then(async (win) => {
      if (!win) {
        return;
      }

      await win.show();
      await win.unminimize();
      await win.setFocus();
    })
    .catch(() => undefined);
}

async function getOrCreateWindow(label?: WindowLabel) {
  const win = await getWindow(label);
  if (win) {
    return win;
  }

  if (label) {
    return createWindow(label);
  }

  return null;
}

export function hideWindow(label?: WindowLabel) {
  getWindow(label)
    .then(async (win) => {
      if (!win) {
        return;
      }

      await win.hide();

      await focusAnotherVisibleWindow();
    })
    .catch(() => undefined);
}

export async function hideAllWindows(): Promise<void> {
  const windows = await WebviewWindow.getAll();
  await Promise.all(windows.map((win) => win.hide()));
}

export function setAlwaysOnTop(alwaysOnTop: boolean, label?: WindowLabel) {
  getWindow(label)
    .then((win) => {
      if (!win) {
        return;
      }

      return win.setAlwaysOnTop(alwaysOnTop);
    })
    .catch(() => undefined);
}
