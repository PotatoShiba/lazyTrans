import { defaultWindowIcon } from "@tauri-apps/api/app";
import { Menu, MenuItem } from "@tauri-apps/api/menu";
import { TrayIcon } from "@tauri-apps/api/tray";
import { exit } from "@tauri-apps/plugin-process";
import { showWindow, toggleWindow } from "./utils/window";

let tray: TrayIcon | null = null;

export async function initTray() {
  if (tray) {
    return tray;
  }
  const translateItem = await MenuItem.new({
    id: "translate",
    text: "翻译",
    action: () => {
      toggleWindow("translator").catch(console.error);
    },
  });

  const screenshotItem = await MenuItem.new({
    id: "screenshot",
    text: "截图翻译",
    action: () => {
      showWindow("screenshot").catch(console.error);
    },
  });

  const settingsItem = await MenuItem.new({
    id: "settings",
    text: "设置",
    action: () => {
      showWindow("settings").catch(console.error);
    },
  });

  const quitItem = await MenuItem.new({
    id: "quit",
    text: "退出",
    action: () => {
      exit(0);
    },
  });

  const menu = await Menu.new({
    items: [translateItem, screenshotItem, settingsItem, quitItem],
  });

  const icon = await defaultWindowIcon();
  if (!icon) {
    throw new Error("Failed to load default window icon");
  }

  const options = {
    icon,
    menu,
    menuOnLeftClick: true,
  };

  tray = await TrayIcon.new(options);
  console.log("Tray icon created:", tray);
  return tray;
}
