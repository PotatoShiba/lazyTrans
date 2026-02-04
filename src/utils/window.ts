import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { WINDOW_CONFIG, type WindowLabel } from "../config/window.config";

/**
 * 获取或创建窗口实例
 * 如果窗口已存在则返回现有窗口，否则创建新窗口
 * @param label - 窗口标识符
 * @returns 窗口实例
 */
export async function ensureWindow(label: WindowLabel) {
  const win = await WebviewWindow.getByLabel(label);
  return win ?? new WebviewWindow(label, WINDOW_CONFIG[label]);
}

/**
 * 显示窗口并聚焦
 * 如果窗口不存在则自动创建，然后显示并设置焦点
 * @param label - 窗口标识符
 * @returns 窗口实例
 */
export async function showWindow(label: WindowLabel) {
  const win = await ensureWindow(label);
  await win.show();
  await win.setFocus();
  return win;
}

/**
 * 隐藏窗口
 * 如果窗口存在则将其隐藏
 * @param label - 窗口标识符
 */
export async function hideWindow(label: WindowLabel) {
  const win = await WebviewWindow.getByLabel(label);
  if (win) {
    await win.hide();
  }
}

/**
 * 关闭窗口
 * 如果窗口存在则将其关闭
 * @param label - 窗口标识符
 */
export async function closeWindow(label: WindowLabel) {
  const win = await WebviewWindow.getByLabel(label);
  if (win) {
    await win.close();
  }
}

/**
 * 切换窗口显示状态
 * 如果窗口可见则隐藏，否则显示并聚焦
 * @param label - 窗口标识符
 */
export async function toggleWindow(label: WindowLabel) {
  const win = await ensureWindow(label);
  const visible = await win.isVisible();

  if (visible) {
    await win.hide();
  } else {
    await win.unminimize();
    await win.show();
    await win.setFocus();
  }
}

/**
 * 检查窗口是否存在
 * @param label - 窗口标识符
 * @returns 窗口是否存在
 */
export async function hasWindow(label: WindowLabel) {
  const win = await WebviewWindow.getByLabel(label);
  return win !== null;
}
