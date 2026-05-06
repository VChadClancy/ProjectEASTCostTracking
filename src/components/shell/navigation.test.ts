import { describe, it, expect } from "vitest";
import { atlasNavigation } from "./navigation";

const lockedNavLabels = [
  "Executive Dashboard",
  "Program Workspace",
  "Forecasting",
  "Actuals Intake",
  "Timeline",
  "Scenarios",
  "Approvals",
  "Reports",
  "Settings",
];

describe("atlasNavigation model", () => {
  it("includes all locked primary nav items", () => {
    const navLabels = atlasNavigation.map((item) => item.label);
    lockedNavLabels.forEach((label) => {
      expect(navLabels).toContain(label);
    });
  });

  it("does not include Atlas AI as a primary nav item", () => {
    const navLabels = atlasNavigation.map((item) => item.label.toLowerCase());
    expect(navLabels.some((label) => label.includes("atlas ai") || label.includes("ask atlas"))).toBe(false);
  });

  it("has unique paths", () => {
    const paths = atlasNavigation.map((item) => item.path);
    const uniquePaths = new Set(paths);
    expect(paths.length).toBe(uniquePaths.size);
  });

  it("has unique ids", () => {
    const ids = atlasNavigation.map((item) => item.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
});
