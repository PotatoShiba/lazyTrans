import type { WebviewOptions } from "@tauri-apps/api/webview";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import {
  currentMonitor,
  cursorPosition,
  type Monitor,
  monitorFromPoint,
  primaryMonitor,
  type WindowOptions,
} from "@tauri-apps/api/window";

export type WindowLabel = "translator" | "settings" | "screenshot";

type WebviewWindowOptions = Omit<
  WebviewOptions,
  "x" | "y" | "width" | "height"
> &
  WindowOptions;

type PositionStrategy = "cursor-center" | "center" | "monitor-fullscreen";

interface WindowDefinition {
  title: string;
  position: PositionStrategy;
  options: WebviewWindowOptions;
}

const WINDOW_DEFINITIONS: Record<WindowLabel, WindowDefinition> = {
  translator: {
    title: "翻译",
    position: "cursor-center",
    options: {
      url: "index.html",
      width: 450,
      height: 350,
      minWidth: 350,
      minHeight: 250,
      resizable: true,
      decorations: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      focus: true,
      visible: false,
    },
  },
  settings: {
    title: "设置 - LazyTrans",
    position: "center",
    options: {
      url: "index.html",
      width: 900,
      height: 650,
      resizable: true,
      decorations: true,
      focus: true,
      visible: false,
    },
  },
  screenshot: {
    title: "截图翻译",
    position: "monitor-fullscreen",
    options: {
      url: "index.html",
      decorations: false,
      transparent: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      resizable: false,
      focus: true,
      visible: false,
    },
  },
};

const creating = new Map<WindowLabel, Promise<WebviewWindow>>();

async function getTargetMonitor(): Promise<Monitor | null> {
  try {
    const cursor = await cursorPosition();
    const monitor = await monitorFromPoint(cursor.x, cursor.y);
    if (monitor) {
      return monitor;
    }
  } catch (error) {
    console.warn("Failed to resolve monitor from cursor:", error);
  }

  return (await currentMonitor()) ?? (await primaryMonitor());
}

function getWorkArea(monitor: Monitor): Monitor["workArea"] {
  return (
    monitor.workArea ?? {
      position: monitor.position,
      size: monitor.size,
    }
  );
}

function centerInArea(
  area: Monitor["workArea"],
  width: number,
  height: number
) {
  const x = Math.round(area.position.x + (area.size.width - width) / 2);
  const y = Math.round(area.position.y + (area.size.height - height) / 2);
  return { x, y };
}

async function resolveWindowOptions(
  definition: WindowDefinition
): Promise<WebviewWindowOptions> {
  const options: WebviewWindowOptions = {
    ...definition.options,
    title: definition.title,
  };

  const monitor = await getTargetMonitor();
  if (!monitor) {
    if (definition.position === "center") {
      return {
        ...options,
        center: true,
      };
    }

    return options;
  }

  const workArea = getWorkArea(monitor);

  if (definition.position === "monitor-fullscreen") {
    return {
      ...options,
      x: monitor.position.x,
      y: monitor.position.y,
      width: monitor.size.width,
      height: monitor.size.height,
    };
  }

  if (
    (definition.position === "cursor-center" ||
      definition.position === "center") &&
    options.width &&
    options.height
  ) {
    const position = centerInArea(workArea, options.width, options.height);
    return {
      ...options,
      x: position.x,
      y: position.y,
    };
  }

  return options;
}

async function createWindow(label: WindowLabel): Promise<WebviewWindow> {
  const definition = WINDOW_DEFINITIONS[label];
  const options = await resolveWindowOptions(definition);

  return new Promise((resolve, reject) => {
    const window = new WebviewWindow(label, options);

    window
      .once("tauri://created", () => {
        resolve(window);
      })
      .catch(reject);

    window
      .once("tauri://error", (event) => {
        reject(
          new Error(
            `Failed to create window ${label}: ${JSON.stringify(event.payload)}`
          )
        );
      })
      .catch(reject);
  });
}

export async function ensureWindow(label: WindowLabel): Promise<WebviewWindow> {
  const existing = await WebviewWindow.getByLabel(label);
  if (existing) {
    return existing;
  }

  const pending = creating.get(label);
  if (pending) {
    return pending;
  }

  const creation = createWindow(label);
  creating.set(label, creation);

  try {
    return await creation;
  } finally {
    creating.delete(label);
  }
}

export async function showWindow(label: WindowLabel): Promise<WebviewWindow> {
  const window = await ensureWindow(label);
  await window.show();
  await window.setFocus();
  return window;
}

export async function hideWindow(label: WindowLabel): Promise<void> {
  const window = await WebviewWindow.getByLabel(label);
  if (!window) {
    return;
  }
  await window.hide();
}

export async function closeWindow(label: WindowLabel): Promise<void> {
  const window = await WebviewWindow.getByLabel(label);
  if (!window) {
    return;
  }
  await window.close();
}

export async function toggleWindow(label: WindowLabel): Promise<void> {
  const window = await ensureWindow(label);
  const visible = await window.isVisible();
  if (visible) {
    await window.hide();
    return;
  }

  await window.show();
  await window.setFocus();
}
