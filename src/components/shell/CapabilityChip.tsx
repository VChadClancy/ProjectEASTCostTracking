import React from "react";
import { atlasTheme } from "../../styles/atlasTheme";

const spacing = {
  xs: "4px",
  sm: "8px",
};

interface CapabilityChipProps {
  label: string;
}

export const CapabilityChip: React.FC<CapabilityChipProps> = ({ label }) => (
  <span
    style={{
      display: "inline-block",
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: "999px",
      background: atlasTheme.colors.mediumGray,
      color: atlasTheme.colors.charcoal,
      fontSize: atlasTheme.typography.caption,
      fontWeight: 500,
      letterSpacing: 0.5,
      marginRight: spacing.xs,
    }}
  >
    {label}
  </span>
);
