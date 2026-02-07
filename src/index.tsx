import { RouterProvider } from "@tanstack/solid-router";
import type { UnlistenFn } from "@tauri-apps/api/event";
import { onCleanup, onMount } from "solid-js";
import { render } from "solid-js/web";
import "./index.css";
import { router } from "./router";
import { listenWindowVisibility } from "./utils/window";

function App() {
  let unlisten: UnlistenFn | null = null;

  onMount(async () => {
    unlisten = await listenWindowVisibility();
  });

  onCleanup(() => {
    unlisten?.();
  });

  return <RouterProvider router={router} />;
}

render(() => <App />, document.getElementById("root") as HTMLElement);
