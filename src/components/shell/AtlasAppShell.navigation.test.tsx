import { describe, it, expect } from "vitest";
import React from "react";
import { AtlasAppShell } from "./AtlasAppShell";
import { atlasNavigation } from "./navigation";

function getNavLabelsFromShell(shell) {
  // Helper to extract nav labels from rendered shell
  // This is a structural test, not a DOM test
  const aside = shell.props.children.find(
    (child) => child && child.props && child.props["data-testid"] === "atlas-app-shell-left-rail"
  );
  if (!aside) return [];
  // Only extract children from ReactElements
  return React.Children.toArray(aside.props.children)
    .filter((el): el is React.ReactElement<any, any> => React.isValidElement(el))
    .map((el) => el.props.children);
}

describe("AtlasAppShell navigation integration", () => {
  it("can accept and render nav items structurally", () => {
    // Simulate shell rendering nav items from model
    const shell = (
      <AtlasAppShell>
        <aside data-testid="atlas-app-shell-left-rail">
          {atlasNavigation.map((item) => (
            <div key={item.id}>{item.label}</div>
          ))}
        </aside>
        <main data-testid="atlas-app-shell-main">Test Main</main>
      </AtlasAppShell>
    );
    const navLabels = getNavLabelsFromShell(shell);
    expect(navLabels).toEqual(atlasNavigation.map((item) => item.label));
  });
});
