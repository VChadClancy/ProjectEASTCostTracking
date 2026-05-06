import React from "react";
import { atlasTheme } from "../../styles/atlasTheme";

const spacing = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
};

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onActionClick,
}) => (
  <div style={{
    textAlign: "center",
    padding: spacing.xl,
    color: atlasTheme.colors.textSecondary,
  }}>
    <h3 style={{ color: atlasTheme.colors.textPrimary, fontSize: atlasTheme.typography.sectionTitle }}>{title}</h3>
    {description && <div style={{ margin: `${spacing.sm} 0` }}>{description}</div>}
    {actionLabel && (
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
        onClick={onActionClick}
      >
        {actionLabel}
      </button>
    )}
  </div>
);
