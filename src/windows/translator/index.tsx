/* @refresh reload */
import { render } from "solid-js/web";
import TranslatorApp from "./translator-app";
import "../../index.css";

render(() => <TranslatorApp />, document.getElementById("root") as HTMLElement);
