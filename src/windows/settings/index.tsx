/* @refresh reload */
import { render } from "solid-js/web";
import SettingsApp from "./settings-app";
import "../../index.css";

render(() => <SettingsApp />, document.getElementById("root") as HTMLElement);
