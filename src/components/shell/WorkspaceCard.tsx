import React from "react";
import { atlasTheme } from "../../styles/atlasTheme";

const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
};

interface WorkspaceCardProps {
  title: string;
  description?: string;
  accent?: React.ReactNode;
  children?: React.ReactNode;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  title,
  description,
  accent,
  children,
}) => (
  <div style={{
    border: `1px solid ${atlasTheme.colors.border}`,
    borderRadius: atlasTheme.layout.cardRadius,
    boxShadow: atlasTheme.layout.cardShadow,
    padding: spacing.lg,
    background: atlasTheme.colors.surface,
    marginBottom: spacing.lg,
    position: "relative",
  }}>
    {accent && <div style={{ position: "absolute", top: spacing.md, right: spacing.md }}>{accent}</div>}
    <h2 style={{ margin: 0, fontSize: atlasTheme.typography.sectionTitle, color: atlasTheme.colors.textPrimary }}>{title}</h2>
    {description && <div style={{ color: atlasTheme.colors.textSecondary, fontSize: atlasTheme.typography.body, marginBottom: spacing.md }}>{description}</div>}
    <div>{children}</div>
  </div>
);
