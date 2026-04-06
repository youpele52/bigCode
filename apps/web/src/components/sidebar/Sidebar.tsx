import { useNavigate } from "@tanstack/react-router";
import { isElectron } from "../../config/env";
import { SettingsSidebarNav } from "../settings/SettingsSidebarNav";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../ui/sidebar";
import { SettingsIcon } from "lucide-react";
import { SidebarUpdatePill } from "./SidebarUpdatePill";
import { SidebarAppHeader } from "./SidebarHeader";
import { SidebarProjectsSection } from "./Sidebar.projectsSection";
import { useSidebarState } from "./Sidebar.state";

export default function Sidebar() {
  const navigate = useNavigate();
  const s = useSidebarState();

  return (
    <>
      <SidebarAppHeader />

      {s.isOnSettings ? (
        <SettingsSidebarNav pathname={s.pathname} />
      ) : (
        <>
          <SidebarProjectsSection
            showArm64IntelBuildWarning={s.showArm64IntelBuildWarning}
            arm64IntelBuildWarningDescription={s.arm64IntelBuildWarningDescription}
            desktopUpdateButton={{
              action: s.desktopUpdateButtonAction,
              disabled: s.desktopUpdateButtonDisabled,
              onClick: s.handleDesktopUpdateButtonClick,
            }}
            appSettingsSidebarProjectSortOrder={s.appSettings.sidebarProjectSortOrder}
            appSettingsSidebarThreadSortOrder={s.appSettings.sidebarThreadSortOrder}
            onProjectSortOrderChange={(sortOrder) => {
              s.updateSettings({ sidebarProjectSortOrder: sortOrder });
            }}
            onThreadSortOrderChange={(sortOrder) => {
              s.updateSettings({ sidebarThreadSortOrder: sortOrder });
            }}
            shouldShowProjectPathEntry={s.shouldShowProjectPathEntry}
            handleStartAddProject={s.handleStartAddProject}
            isElectron={isElectron}
            newCwd={s.newCwd}
            isPickingFolder={s.isPickingFolder}
            isAddingProject={s.isAddingProject}
            addProjectError={s.addProjectError}
            addProjectInputRef={s.addProjectInputRef}
            onCwdChange={s.setNewCwd}
            onClearError={() => s.setAddProjectError(null)}
            onPickFolder={() => void s.handlePickFolder()}
            onAdd={s.handleAddProject}
            onCancelAdd={s.cancelAddProject}
            renderedProjects={s.renderedProjects}
            isManualProjectSorting={s.isManualProjectSorting}
            bootstrapComplete={s.bootstrapComplete}
            hasProjects={s.projects.length > 0}
            onDragStart={s.handleProjectDragStart}
            onDragEnd={s.handleProjectDragEnd}
            onDragCancel={s.handleProjectDragCancel}
            sharedProjectItemProps={s.sharedProjectItemProps}
          />

          <SidebarSeparator />
          <SidebarFooter className="p-2">
            <SidebarUpdatePill />
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="sm"
                  className="gap-2 px-2 py-1.5 text-muted-foreground/70 hover:bg-accent hover:text-foreground"
                  onClick={() => void navigate({ to: "/settings" })}
                >
                  <SettingsIcon className="size-3.5" />
                  <span className="text-xs">Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </>
      )}
    </>
  );
}
