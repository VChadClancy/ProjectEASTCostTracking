import React from "react";
import { atlasTheme } from "../../styles/atlasTheme";

interface AtlasAppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export const AtlasAppShell: React.FC<AtlasAppShellProps> = ({ children, pageTitle }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: atlasTheme.colors.background,
        color: atlasTheme.colors.textPrimary,
      }}
      data-testid="atlas-app-shell-root"
    >
      {/* Left Rail */}
      <aside
        style={{
          width: atlasTheme.layout.leftRailWidth,
          background: atlasTheme.colors.surfaceMuted,
          borderRight: `1px solid ${atlasTheme.colors.border}`,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: atlasTheme.layout.pagePadding,
        }}
        data-testid="atlas-app-shell-left-rail"
      >
        {/* Future nav items go here */}
      </aside>
      {/* Main Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <header
          style={{
            height: atlasTheme.layout.topBarHeight,
            background: atlasTheme.colors.surface,
            borderBottom: `1px solid ${atlasTheme.colors.border}`,
            display: "flex",
            alignItems: "center",
            padding: `0 ${atlasTheme.layout.pagePadding}`,
            justifyContent: "space-between",
          }}
          data-testid="atlas-app-shell-top-bar"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: atlasTheme.typography.title,
                color: atlasTheme.colors.primary,
                letterSpacing: "0.04em",
              }}
              data-testid="atlas-app-shell-product-name"
            >
              Atlas OS
            </span>
            <span
              style={{
                fontWeight: 500,
                fontSize: atlasTheme.typography.sectionTitle,
                color: atlasTheme.colors.textSecondary,
              }}
              data-testid="atlas-app-shell-page-title"
            >
              {pageTitle || "Page Title"}
            </span>
          </div>
          <div
            style={{
              background: atlasTheme.colors.surfaceMuted,
              border: `1px solid ${atlasTheme.colors.border}`,
              borderRadius: "8px",
              padding: "6px 16px",
              color: atlasTheme.colors.primary,
              fontWeight: 500,
              fontSize: atlasTheme.typography.body,
              minWidth: "120px",
              textAlign: "center",
            }}
            data-testid="atlas-app-shell-ask-atlas"
          >
            Ask Atlas
          </div>
        </header>
        {/* Workspace/Main Content */}
        <main
          style={{
            flex: 1,
            padding: atlasTheme.layout.pagePadding,
            background: atlasTheme.colors.background,
            minHeight: 0,
          }}
          data-testid="atlas-app-shell-main"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export const atlasShellTestIds = {
  root: "atlas-app-shell-root",
  leftRail: "atlas-app-shell-left-rail",
  topBar: "atlas-app-shell-top-bar",
  main: "atlas-app-shell-main",
  productName: "atlas-app-shell-product-name",
  askAtlas: "atlas-app-shell-ask-atlas",
};
