import { Link, Outlet } from "@tanstack/solid-router";
import { For } from "solid-js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "../../components/ui/sidebar";
import { useI18n } from "../../i18n";
import { settingsMenuItems } from "./config";

function SettingsLayout() {
  const { t } = useI18n();

  return (
    <SidebarProvider class="bg-background text-foreground">
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div class="flex items-center gap-2 px-2 py-1">
            <div class="font-semibold text-sm">logo</div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t("settings.title")}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <For each={settingsMenuItems}>
                  {(item) => (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        activeOptions={{ exact: item.id === "general" }}
                        activeProps={{
                          class:
                            "bg-sidebar-accent text-sidebar-accent-foreground",
                        }}
                        as={Link}
                        class="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        to={item.to}
                      >
                        <span class={`${item.icon} size-4 shrink-0`} />
                        <span>{t(item.labelKey)}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </For>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header class="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger class="-ml-1 text-foreground" />
        </header>
        <main class="flex-1 overflow-auto p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default SettingsLayout;
