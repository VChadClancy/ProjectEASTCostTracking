import React from "react";
import { atlasTheme } from "../../styles/atlasTheme";

const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
};

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  primaryActionLabel?: string;
  onPrimaryActionClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  eyebrow,
  description,
  primaryActionLabel,
  onPrimaryActionClick,
}) => (
  <header style={{ padding: spacing.lg, borderBottom: `1px solid ${atlasTheme.colors.border}` }}>
    {eyebrow && (
      <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.caption, fontWeight: 600, letterSpacing: 1 }}>{eyebrow}</div>
    )}
    <h1 style={{ margin: 0, fontSize: atlasTheme.typography.title, color: atlasTheme.colors.textPrimary }}>{title}</h1>
    {description && (
      <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.body, marginTop: spacing.xs }}>{description}</div>
    )}
    {primaryActionLabel && (
      <button
        style={{
          marginTop: spacing.md,
          background: atlasTheme.colors.primary,
          color: "#fff",
          border: "none",
          borderRadius: atlasTheme.layout.cardRadius,
          padding: `${spacing.xs} ${spacing.md}`,
          fontWeight: 600,
          cursor: "pointer",
        }}
        onClick={onPrimaryActionClick}
      >
        {primaryActionLabel}
      </button>
    )}
  </header>
);
