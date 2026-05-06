import { describe, it, expect } from "vitest";
import React, { ReactElement } from "react";
import App from "./App";
import { AtlasAppShell } from "./components/shell/AtlasAppShell";

function isReactElement(node: unknown): node is ReactElement {
  return !!node && typeof node === "object" && "type" in node && "props" in node;
}

// Structural test: App renders inside AtlasAppShell and renders financial content

describe("App shell integration", () => {
  it("renders inside AtlasAppShell and shows Program Workspace heading", () => {
    const el = <App />;
    // Should be an AtlasAppShell at the top level
    expect(el.type).toBe(AtlasAppShell);
    // Should render a PageHeader with Program Workspace
    const children = React.Children.toArray(el.props.children);
    const pageHeader = children.find(
      (child): child is ReactElement =>
        isReactElement(child) &&
        typeof child.type === "function" &&
        (child.type as any).name === "PageHeader"
    );
    expect(pageHeader).toBeDefined();
    if (pageHeader && isReactElement(pageHeader)) {
      expect((pageHeader.props as any).title).toMatch(/Program Workspace/);
    }
    // Should render WorkspaceCard(s) with summary/rollup
    const workspaceCards = children.filter(
      (child): child is ReactElement =>
        isReactElement(child) &&
        typeof child.type === "function" &&
        (child.type as any).name === "WorkspaceCard"
    );
    expect(workspaceCards.length).toBeGreaterThan(0);
    // Should still render charts and monthly grid
    const hasCharts = workspaceCards.some((card) => {
      if (!isReactElement(card)) return false;
      const cardChildren = React.Children.toArray((card.props as any).children);
      return cardChildren.some(
        (c) => isReactElement(c) && typeof c.type === "function" && (c.type as any).name === "Charts"
      );
    });
    expect(hasCharts).toBe(true);
  });
});
