import { render } from "solid-js/web";
import { useAppShortcuts } from "./hooks/use-app-shortcuts";
import { useTray } from "./hooks/use-tray";

function Daemon() {
  useTray();
  useAppShortcuts();

  return null;
}

render(() => <Daemon />, document.getElementById("root") as HTMLElement);
