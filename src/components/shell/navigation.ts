// src/components/shell/navigation.ts

export interface AtlasNavItem {
  id: string;
  label: string;
  path: string;
  description: string;
}

export const atlasNavigation: AtlasNavItem[] = [
  {
    id: "executive-dashboard",
    label: "Executive Dashboard",
    path: "/executive-dashboard",
    description: "High-level summary and KPIs for executives.",
  },
  {
    id: "program-workspace",
    label: "Program Workspace",
    path: "/program-workspace",
    description: "Workspace for managing programs and initiatives.",
  },
  {
    id: "forecasting",
    label: "Forecasting",
    path: "/forecasting",
    description: "View forecast versions, planning outlooks, and projected financials.",
  },
  {
    id: "actuals-intake",
    label: "Actuals Intake",
    path: "/actuals-intake",
    description: "Input and review actual financial data.",
  },
  {
    id: "timeline",
    label: "Timeline",
    path: "/timeline",
    description: "View and manage project timelines.",
  },
  {
    id: "scenarios",
    label: "Scenarios",
    path: "/scenarios",
    description: "Model and compare what-if scenarios.",
  },
  {
    id: "approvals",
    label: "Approvals",
    path: "/approvals",
    description: "Track and manage approval workflows.",
  },
  {
    id: "reports",
    label: "Reports",
    path: "/reports",
    description: "Generate and view reports.",
  },
  {
    id: "settings",
    label: "Settings",
    path: "/settings",
    description: "Configure application preferences and settings.",
  },
];
