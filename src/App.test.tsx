import App, {
  defaultAtlasPageTitle,
  DEFAULT_APP_PAGE_ID,
  appPages,
  getDefaultAppPage,
  getAppPageById,
  getAppPageRenderModel
} from "./App";
import { describe, it, expect } from "vitest";
import { ProgramWorkspace, getProgramWorkspaceRenderModel } from "./features/programWorkspace/ProgramWorkspace";
import { getPrimaryProgramWorkspaceSections, getFutureProgramWorkspaceSections } from "./features/programWorkspace/programWorkspaceModel";
import { AtlasAppShell } from "./components/shell/AtlasAppShell";


describe("App", () => {
  it("should be a function (React component)", () => {
    expect(typeof App).toBe("function");
  });

  it("should export the default Atlas page title for shell integration", () => {
    expect(defaultAtlasPageTitle).toBe("Program Workspace");
  });

  it("should export the default app page id and helpers", () => {
    expect(DEFAULT_APP_PAGE_ID).toBe("program-workspace");
    expect(getDefaultAppPage().id).toBe("program-workspace");
    expect(getAppPageById("forecasting").id).toBe("forecasting");
    expect(appPages.some(p => p.id === "forecasting")).toBe(true);
  });

  it("should provide a render model with correct page and nav metadata", () => {
    const model = getAppPageRenderModel();
    expect(model.defaultPageId).toBe("program-workspace");
    expect(model.pageIds).toContain("program-workspace");
    expect(model.pageIds).toContain("forecasting");
    expect(model.navIds).toContain("program-workspace");
    expect(model.navIds).toContain("forecasting");
    expect(model.pageLabels).toContain("Program Workspace");
    expect(model.pageLabels).toContain("Forecasting");
  });
});

describe("App integration with ProgramWorkspace", () => {
  it("should use ProgramWorkspace as the default workspace (by metadata)", () => {
    expect(getDefaultAppPage().component).toBe(ProgramWorkspace);
  });

  it("should not introduce unsupported workflow labels", () => {
    // Check that unsupported workflow labels are not present in ProgramWorkspace render model
    const { unsupportedWorkflowLabels } = getProgramWorkspaceRenderModel();
    const allTitles = [
      ...getPrimaryProgramWorkspaceSections().map(s => s.title),
      ...getFutureProgramWorkspaceSections().map(s => s.title)
    ].join(' ');
    unsupportedWorkflowLabels.forEach(label => {
      expect(allTitles).not.toMatch(new RegExp(label, 'i'));
    });
  });
});
