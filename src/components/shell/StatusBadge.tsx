import React from "react";
import { atlasTheme } from "../../styles/atlasTheme";

const spacing = {
  xs: "4px",
  sm: "8px",
};

type StatusVariant = "success" | "warning" | "danger" | "info" | "neutral" | "ai";

const variantColors: Record<StatusVariant, { bg: string; color: string }> = {
  success: { bg: atlasTheme.colors.success, color: "#fff" },
  warning: { bg: atlasTheme.colors.warning, color: atlasTheme.colors.charcoal },
  danger: { bg: atlasTheme.colors.danger, color: "#fff" },
  info: { bg: atlasTheme.colors.info, color: "#fff" },
  neutral: { bg: atlasTheme.colors.mediumGray, color: atlasTheme.colors.charcoal },
  ai: { bg: atlasTheme.colors.aiInsight, color: "#fff" },
};

interface StatusBadgeProps {
  variant: StatusVariant;
  children: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ variant, children }) => (
  <span
    style={{
      display: "inline-block",
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: "999px",
      fontSize: atlasTheme.typography.caption,
      fontWeight: 600,
      background: variantColors[variant].bg,
      color: variantColors[variant].color,
      textTransform: "uppercase",
      letterSpacing: 1,
    }}
    data-variant={variant}
  >
    {children}
  </span>
);
