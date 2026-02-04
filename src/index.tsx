import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import type { Component } from "solid-js";
import { render } from "solid-js/web";
import "./index.css";
import { initTray } from "./tray";
import ScreenshotApp from "./windows/screenshot/screenshot-app";
import SettingsApp from "./windows/settings/settings-app";
import TranslatorApp from "./windows/translator/translator-app";

const windowMap: Record<string, Component> = {
  daemon: () => null,
  translator: TranslatorApp,
  settings: SettingsApp,
  screenshot: ScreenshotApp,
};

const WindowRoot: Component = () => {
  const currentWebview = getCurrentWebviewWindow();
  const label = currentWebview.label;

  if (label === "daemon") {
    initTray().catch(console.error);
  }

  const WindowComponent = windowMap[label ?? "daemon"];

  return <WindowComponent />;
};

render(() => <WindowRoot />, document.getElementById("root") as HTMLElement);
