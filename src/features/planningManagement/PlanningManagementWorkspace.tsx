import React from "react";
import { getPlanningManagementSections } from "./planningManagementModel";
import { PlanningLineDetailDrawer } from "./PlanningLineDetailDrawer";
import { PlanningLineFormStructure } from "./PlanningLineFormStructure";

// Minimal workspace shell for Sprint 17 integration
export const PlanningManagementWorkspace: React.FC = () => {
  const sections = getPlanningManagementSections();
  return (
    <div data-testid="planning-management-workspace" style={{ padding: 32, background: "#f8fafc", minHeight: 400 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#003366" }}>Planning Management Workspace</h1>
      <ul style={{ margin: "24px 0", padding: 0, listStyle: "none" }}>
        {sections.map((section) => (
          <li key={section.id} style={{ marginBottom: 12 }}>
            <strong>{section.title}</strong>
            <div style={{ color: "#666", fontSize: 14 }}>{section.description}</div>
          </li>
        ))}
      </ul>
      {/* Represent Financial Lines and FTE/Labor Lines sections */}
      <section data-testid="financial-lines-section">
        <h2 style={{ fontSize: 18, color: "#003366" }}>Financial Lines</h2>
        {/* Placeholder for financial lines list */}
        <div style={{ color: "#888" }}>[Financial lines list here]</div>
      </section>
      <section data-testid="fte-labor-lines-section">
        <h2 style={{ fontSize: 18, color: "#003366" }}>FTE/Labor Lines</h2>
        {/* Placeholder for FTE/labor lines list */}
        <div style={{ color: "#888" }}>[FTE/labor lines list here]</div>
      </section>
      {/* Represent form structure UI */}
      <section data-testid="planning-line-form-structure">
        <h2 style={{ fontSize: 18, color: "#003366" }}>Create/Edit Planning Line</h2>
        <PlanningLineFormStructure mode="financial" readOnly />
        <PlanningLineFormStructure mode="fteLabor" readOnly />
      </section>
      {/* Represent detail drawer UI (not open by default) */}
      <PlanningLineDetailDrawer open={false} onClose={() => {}} />
    </div>
  );
};

// Helper for tests
export function getPlanningManagementWorkspaceRenderModel() {
  const sections = getPlanningManagementSections();
  return {
    sectionTitles: sections.map((s) => s.title),
    hasFinancialLinesSection: sections.some((s) => s.title.toLowerCase().includes("financial")),
    hasFteLaborLinesSection: sections.some((s) => s.title.toLowerCase().includes("fte/labor")),
    unsupportedWorkflowLabels: [
      "Approve",
      "Run AI Recommendation",
      "Import Invoice",
      "Detect Overallocation",
    ],
  };
}
