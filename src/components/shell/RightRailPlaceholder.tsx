import React from "react";
import { atlasTheme } from "../../styles/atlasTheme";

export const RightRailPlaceholder: React.FC = () => (
  <aside
    style={{
      width: 320,
      minHeight: 400,
      background: atlasTheme.colors.surface,
      borderLeft: `1px solid ${atlasTheme.colors.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: atlasTheme.colors.textSecondary,
      fontSize: atlasTheme.typography.body,
      fontStyle: "italic",
    }}
    aria-label="Contextual Panel Placeholder"
  >
    Contextual Panel Placeholder
  </aside>
);
