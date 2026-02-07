use tauri::{async_runtime::spawn, AppHandle, Manager, Runtime, WebviewWindow};

mod common;

pub use common::*;

fn shared_show_window<R: Runtime>(_app_handle: &AppHandle<R>, window: &WebviewWindow<R>) {
    let _ = window.show();
    let _ = window.unminimize();
    let _ = window.set_focus();
}

fn shared_hide_window<R: Runtime>(_app_handle: &AppHandle<R>, window: &WebviewWindow<R>) {
    let _ = window.hide();
}

fn shared_set_always_on_top<R: Runtime>(
    _app_handle: &AppHandle<R>,
    window: &WebviewWindow<R>,
    always_on_top: bool,
) {
    if always_on_top {
        let _ = window.set_always_on_bottom(false);
        let _ = window.set_always_on_top(true);
    } else {
        let _ = window.set_always_on_top(false);
        let _ = window.set_always_on_bottom(true);
    }
}

pub fn show_window_by_label<R: Runtime>(app_handle: &AppHandle<R>, label: &str) {
    if let Some(window) = app_handle.get_webview_window(label) {
        let app_handle_clone = app_handle.clone();

        spawn(async move {
            show_window(app_handle_clone, window).await;
        });
    }
}

pub fn hide_window_by_label<R: Runtime>(app_handle: &AppHandle<R>, label: &str) {
    if let Some(window) = app_handle.get_webview_window(label) {
        let app_handle_clone = app_handle.clone();

        spawn(async move {
            hide_window(app_handle_clone, window).await;
        });
    }
}
