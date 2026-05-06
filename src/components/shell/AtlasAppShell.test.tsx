import { describe, it, expect } from "vitest";
import React from "react";
import { AtlasAppShell, atlasShellTestIds } from "./AtlasAppShell";

// Helper: create a React element for inspection
const makeShell = (props = {}) =>
  <AtlasAppShell {...props}><div>Test Child</div></AtlasAppShell>;

describe("AtlasAppShell", () => {
  it("is a function/component", () => {
    expect(typeof AtlasAppShell).toBe("function");
  });

  it("returns a defined React element when given children", () => {
    const el = makeShell();
    expect(el).toBeDefined();
    expect(React.isValidElement(el)).toBe(true);
  });

  it("accepts children", () => {
    const el = makeShell();
    expect(el.props.children).toBeDefined();
    expect(el.props.children.type).toBe("div");
    expect(el.props.children.props.children).toBe("Test Child");
  });

  it("exports shell test ID constants", () => {
    expect(atlasShellTestIds).toBeDefined();
    expect(atlasShellTestIds.root).toBe("atlas-app-shell-root");
    expect(atlasShellTestIds.leftRail).toBe("atlas-app-shell-left-rail");
    expect(atlasShellTestIds.topBar).toBe("atlas-app-shell-top-bar");
    expect(atlasShellTestIds.main).toBe("atlas-app-shell-main");
    expect(atlasShellTestIds.productName).toBe("atlas-app-shell-product-name");
    expect(atlasShellTestIds.askAtlas).toBe("atlas-app-shell-ask-atlas");
  });
});
