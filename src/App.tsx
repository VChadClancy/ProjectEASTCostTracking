import React from "react";
import { AtlasAppShell } from "./components/shell/AtlasAppShell";
import { ProgramWorkspace } from "./features/programWorkspace/ProgramWorkspace";

export const defaultAtlasPageTitle = "Program Workspace";

function App() {
  return (
    <AtlasAppShell pageTitle={defaultAtlasPageTitle}>
      <ProgramWorkspace />
    </AtlasAppShell>
  );
}

export default App;