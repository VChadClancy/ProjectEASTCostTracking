import React, { useState, useCallback } from "react";
import { AtlasAppShell } from "./components/shell/AtlasAppShell";
import { ProgramWorkspace } from "./features/programWorkspace/ProgramWorkspace";
import { ForecastManagementWorkspace } from "./features/forecastManagement/ForecastManagementWorkspace";
import { atlasNavigation } from "./components/shell/navigation";

export const defaultAtlasPageTitle = "Program Workspace";

export const DEFAULT_APP_PAGE_ID = "program-workspace";

export const appPages = [
  { id: "program-workspace", label: "Program Workspace", component: ProgramWorkspace },
  { id: "forecasting", label: "Forecasting", component: ForecastManagementWorkspace },
];

export function getDefaultAppPage() {
  return appPages[0];
}

export function getAppPageById(pageId: string) {
  return appPages.find((p) => p.id === pageId) || appPages[0];
}

export function getAppPageRenderModel() {
  return {
    defaultPageId: DEFAULT_APP_PAGE_ID,
    pageIds: appPages.map((p) => p.id),
    pageLabels: appPages.map((p) => p.label),
    navIds: atlasNavigation.map((n) => n.id),
    navLabels: atlasNavigation.map((n) => n.label),
  };
}

const PAGE_COMPONENTS: Record<string, React.FC> = {
  "program-workspace": ProgramWorkspace,
  "forecasting": ForecastManagementWorkspace,
};

function App() {
  // Default to Program Workspace
  const [selectedPageId, setSelectedPageId] = useState(DEFAULT_APP_PAGE_ID);

  const handleNavigate = useCallback((pageId: string) => {
    setSelectedPageId(pageId);
  }, []);

  const activeNav = atlasNavigation.find((item) => item.id === selectedPageId) || atlasNavigation[0];
  const PageComponent = PAGE_COMPONENTS[selectedPageId] || (() => null);

  return (
    <AtlasAppShell
      pageTitle={activeNav.label}
      activePageId={selectedPageId}
      onNavigate={handleNavigate}
    >
      <PageComponent />
    </AtlasAppShell>
  );
}

export default App;