import App, { defaultAtlasPageTitle } from "./App";
import { describe, it, expect } from "vitest";

describe("App", () => {
  it("should be a function (React component)", () => {
    expect(typeof App).toBe("function");
  });

  it("should export the default Atlas page title for shell integration", () => {
    expect(defaultAtlasPageTitle).toBe("Program Workspace");
  });
});
