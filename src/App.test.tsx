import App, { defaultAtlasPageTitle } from "./App";
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
});

describe("App integration with ProgramWorkspace", () => {
  it("should use ProgramWorkspace as the default workspace", () => {
    // Structural test: App renders AtlasAppShell with ProgramWorkspace as child
    const app = App();
    expect(app.type).toBe(AtlasAppShell);
    const shellChild = app.props.children;
    // ProgramWorkspace is the main content
    expect(shellChild.type).toBe(ProgramWorkspace);
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
