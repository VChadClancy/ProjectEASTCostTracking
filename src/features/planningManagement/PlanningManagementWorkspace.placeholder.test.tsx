import { describe, it, expect } from "vitest";
import { getPlanningManagementWorkspaceRenderModel } from "./PlanningManagementWorkspace";

describe("PlanningManagementWorkspace placeholder/section logic", () => {
  it("does not include placeholder/coming soon/coming later in section titles", () => {
    const model = getPlanningManagementWorkspaceRenderModel();
    const allTitles = model.sectionTitles.join(" ").toLowerCase();
    expect(allTitles).not.toMatch(/coming soon|coming later|placeholder/);
  });
});
