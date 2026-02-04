import { Route, Router } from "@solidjs/router";
import { lazy } from "solid-js";

const SettingsLayout = lazy(() => import("./layout"));
const GeneralSettings = lazy(() => import("./pages/general"));
const AppearanceSettings = lazy(() => import("./pages/appearance"));
const ShortcutsSettings = lazy(() => import("./pages/shortcuts"));
const LanguageSettings = lazy(() => import("./pages/language"));
const AboutSettings = lazy(() => import("./pages/about"));

function SettingsApp() {
  return (
    <Router>
      <Route component={SettingsLayout} path="/">
        <Route component={GeneralSettings} path="/" />
        <Route component={GeneralSettings} path="/general" />
        <Route component={AppearanceSettings} path="/appearance" />
        <Route component={ShortcutsSettings} path="/shortcuts" />
        <Route component={LanguageSettings} path="/language" />
        <Route component={AboutSettings} path="/about" />
      </Route>
    </Router>
  );
}

export default SettingsApp;
