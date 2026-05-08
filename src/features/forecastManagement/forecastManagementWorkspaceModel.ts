// Forecast Management Workspace Model for Sprint 14
// Structure only, no data fetching, UI, or backend logic

export type ForecastManagementWorkspaceSectionStatus =
  | 'active'
  | 'preview'
  | 'future'
  | 'placeholder';

export interface ForecastManagementWorkspaceSection {
  id: string;
  title: string;
  description: string;
  order: number;
  capabilityArea: string;
  status: ForecastManagementWorkspaceSectionStatus;
}

export const forecastManagementWorkspaceSections: ForecastManagementWorkspaceSection[] = [
  {
    id: 'versionSelector',
    title: 'Version Selector',
    description: 'Select current and comparison forecast versions.',
    order: 1,
    capabilityArea: 'versioning',
    status: 'active',
  },
  {
    id: 'forecastSummaryCards',
    title: 'Forecast Summary Cards',
    description: 'Summary cards for key forecast metrics.',
    order: 2,
    capabilityArea: 'summary',
    status: 'active',
  },
  {
    id: 'currentVersionMetadata',
    title: 'Current Version Metadata',
    description: 'Metadata for the selected forecast version.',
    order: 3,
    capabilityArea: 'versioning',
    status: 'active',
  },
  {
    id: 'snapshotSummary',
    title: 'Snapshot Summary',
    description: 'Read-only summary of the current forecast snapshot.',
    order: 4,
    capabilityArea: 'snapshot',
    status: 'active',
  },
  {
    id: 'snapshotLinesPreview',
    title: 'Snapshot Lines Preview',
    description: 'Read-only preview of forecast snapshot lines.',
    order: 5,
    capabilityArea: 'snapshot',
    status: 'preview', // Not editable, preview only
  },
  {
    id: 'recentVersions',
    title: 'Recent Versions',
    description: 'Panel showing recent forecast versions.',
    order: 6,
    capabilityArea: 'versioning',
    status: 'active',
  },
  {
    id: 'comparisonOverview',
    title: 'Comparison Overview',
    description: 'Overview of current vs comparison version. No edit workflow.',
    order: 7,
    capabilityArea: 'comparison',
    status: 'preview', // Preview/active, not full workflow
  },
  {
    id: 'deltaSignalsPreview',
    title: 'Delta Signals Preview',
    description: 'Preview of delta signals between versions.',
    order: 8,
    capabilityArea: 'comparison',
    status: 'future', // Placeholder for future
  },
];

export function getForecastManagementWorkspaceSections(): ForecastManagementWorkspaceSection[] {
  return forecastManagementWorkspaceSections;
}

export function getPrimaryForecastManagementWorkspaceSections(): ForecastManagementWorkspaceSection[] {
  // MED guidance: 3–6 primary modules visible by default
  return forecastManagementWorkspaceSections.filter(
    (section) =>
      section.status === 'active' ||
      section.status === 'preview'
  ).slice(0, 6);
}

export function getPreviewForecastManagementWorkspaceSections(): ForecastManagementWorkspaceSection[] {
  return forecastManagementWorkspaceSections.filter((section) => section.status === 'preview');
}

export function getFutureForecastManagementWorkspaceSections(): ForecastManagementWorkspaceSection[] {
  return forecastManagementWorkspaceSections.filter((section) => section.status === 'future' || section.status === 'placeholder');
}
