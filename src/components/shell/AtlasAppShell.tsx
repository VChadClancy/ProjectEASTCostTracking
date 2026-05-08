import React, { useState, useEffect } from "react";
import { atlasTheme } from "../../styles/atlasTheme";
import { atlasNavigation, AtlasNavItem } from "./navigation";

interface AtlasAppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  activePageId?: string;
  onNavigate?: (pageId: string) => void;
}

export const AtlasAppShell: React.FC<AtlasAppShellProps> = ({ children, pageTitle, activePageId, onNavigate }) => {
  // Local state for uncontrolled usage
  const [internalNav, setInternalNav] = useState(
    atlasNavigation.find((item) => item.label === "Program Workspace") || atlasNavigation[0]
  );

  // Controlled vs uncontrolled nav selection
  const selectedNav = activePageId
    ? atlasNavigation.find((item) => item.id === activePageId) || atlasNavigation[0]
    : internalNav;

  // Keep internalNav in sync if controlled
  useEffect(() => {
    if (activePageId) {
      const nav = atlasNavigation.find((item) => item.id === activePageId);
      if (nav) setInternalNav(nav);
    }
  }, [activePageId]);

  function handleNavClick(item: AtlasNavItem) {
    if (onNavigate) {
      onNavigate(item.id);
    } else {
      setInternalNav(item);
    }
  }

  // Placeholder page content
  function renderPagePlaceholder(nav: AtlasNavItem) {
    // Show financials content for Forecasting/Actuals Intake
    if (nav.label === "Forecasting" || nav.label === "Actuals Intake") {
      return children;
    }
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "24px",
        padding: "32px 0 0 0"
      }}>
        <h1 style={{
          fontSize: atlasTheme.typography.title,
          fontWeight: 700,
          color: atlasTheme.colors.primary,
          margin: 0
        }}>{nav.label}</h1>
        <p style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.body, margin: 0 }}>{nav.description}</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <span style={{
            background: atlasTheme.colors.surfaceMuted,
            border: `1px solid ${atlasTheme.colors.border}`,
            borderRadius: "16px",
            padding: "4px 12px",
            color: atlasTheme.colors.textSecondary,
            fontSize: atlasTheme.typography.body,
            fontWeight: 500
          }}>Coming later</span>
        </div>
      </div>
    );
  }

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
          gap: "8px"
        }}
        data-testid="atlas-app-shell-left-rail"
      >
        {atlasNavigation.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item)}
            style={{
              width: "100%",
              background: selectedNav.id === item.id ? atlasTheme.colors.surface : "transparent",
              color: selectedNav.id === item.id ? atlasTheme.colors.primary : atlasTheme.colors.textSecondary,
              border: "none",
              borderRadius: "8px",
              padding: "12px 16px",
              fontWeight: 600,
              fontSize: atlasTheme.typography.body,
              textAlign: "left",
              cursor: "pointer",
              transition: "background 0.2s, color 0.2s"
            }}
            aria-current={selectedNav.id === item.id ? "page" : undefined}
            data-testid={`atlas-nav-item-${item.id}`}
          >
            {item.label}
          </button>
        ))}
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
              {selectedNav.label}
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
          {renderPagePlaceholder(selectedNav)}
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
