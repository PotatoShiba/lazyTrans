import { render } from "solid-js/web";
import { openTranslator } from "./actions/window";
import { useAppShortcuts } from "./hooks/use-app-shortcuts";
import { useTray } from "./hooks/use-tray";

function Daemon() {
  useTray();
  useAppShortcuts({
    translate: () => openTranslator(),
  });

  return null;
}

render(() => <Daemon />, document.getElementById("root") as HTMLElement);
