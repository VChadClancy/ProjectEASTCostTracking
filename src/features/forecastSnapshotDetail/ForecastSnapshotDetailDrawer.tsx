import React from 'react';
import { ForecastSnapshotSelectedLineDetailViewModelWithFormatted } from './forecastSnapshotDetailModel';
import { emptyForecastSnapshotDetailViewModel } from './forecastSnapshotDetailDataAdapter';
import { atlasTheme } from '../../styles/atlasTheme';

export interface ForecastSnapshotDetailDrawerProps {
  isOpen: boolean;
  detail?: ForecastSnapshotSelectedLineDetailViewModelWithFormatted | null;
  onClose: () => void;
  title?: string;
  label?: string;
}

export const ForecastSnapshotDetailDrawer: React.FC<ForecastSnapshotDetailDrawerProps> = ({
  isOpen,
  detail,
  onClose,
  title,
  label,
}) => {
  if (!isOpen) return null;
  const d = detail || emptyForecastSnapshotDetailViewModel;

  // Helper: never show raw JSON-like strings
  const safe = (val: string | undefined) => {
    if (!val) return '';
    if (/^\{.*\}$/.test(val.trim())) return '';
    return val;
  };

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100%',
        width: 400,
        background: '#fff',
        boxShadow: 'rgba(0,0,0,0.12) -4px 0 24px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: `4px solid ${atlasTheme.colors.eatonBlue}`,
      }}
      data-testid="forecast-snapshot-detail-drawer"
    >
      {/* Header */}
      <header
        style={{
          background: atlasTheme.colors.eatonBlue,
          color: '#fff',
          padding: '1.25rem 1.5rem 1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 20 }}>
            {title || 'Forecast Snapshot Detail'}
          </div>
          <div style={{ fontSize: 14, opacity: 0.85 }}>
            {label || safe(d.project) || 'No Project'}
          </div>
        </div>
        <button
          aria-label="Close Drawer"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#fff',
            fontSize: 22,
            cursor: 'pointer',
            marginLeft: 8,
          }}
        >
          ×
        </button>
      </header>

      {/* Read-only badge */}
      <div style={{
        alignSelf: 'flex-end',
        margin: '0.5rem 1.5rem 0 0',
        fontSize: 12,
        color: atlasTheme.colors.eatonBlue,
        border: `1px solid ${atlasTheme.colors.eatonBlue}`,
        borderRadius: 8,
        padding: '2px 10px',
        fontWeight: 600,
        background: '#f5faff',
        display: 'inline-block',
      }}>
        Read-only
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
        {/* Selected Line Summary */}
        <section style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Selected Line Summary</div>
          <div style={{ fontSize: 14, color: '#222' }}>
            <span>{safe(d.car)}</span>
            {d.car && d.month ? ' · ' : ''}
            <span>{safe(d.month)}</span>
            {d.costCategory ? ' · ' : ''}
            <span>{safe(d.costCategory)}</span>
            {d.budgetStream ? ' · ' : ''}
            <span>{safe(d.budgetStream)}</span>
          </div>
        </section>

        {/* Financial Values */}
        <section style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Financial Values</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <KPIBlock label="Forecast" value={d.formattedForecast} />
            <KPIBlock label="Actual" value={d.formattedActual} />
            <KPIBlock label="Budget" value={d.formattedBudget} />
            <KPIBlock label="Variance" value={d.formattedVariance} />
          </div>
        </section>

        {/* Monthly Context */}
        <section style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Monthly Context</div>
          <div style={{ fontSize: 14 }}>
            <span>Month: {safe(d.month) || 'N/A'}</span>
          </div>
        </section>

        {/* Classification Details */}
        <section style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Classification Details</div>
          <div style={{ fontSize: 14 }}>
            <span>Cost Category: {safe(d.costCategory) || 'N/A'}</span><br />
            <span>Budget Stream: {safe(d.budgetStream) || 'N/A'}</span><br />
            <span>Severity: {safe(d.severity) || 'N/A'}</span>
          </div>
        </section>

        {/* Version / Source Metadata */}
        <section style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Version / Source Metadata</div>
          <div style={{ fontSize: 14 }}>
            <span>Version: {safe(d.versionName) || 'N/A'}</span><br />
            <span>Kind: {safe(d.versionKind) || 'N/A'}</span><br />
            <span>Status: {safe(d.versionStatus) || 'N/A'}</span><br />
            <span>Source: {safe(d.sourceLabel) || 'N/A'}</span><br />
            <span>Source Metadata: {safe(d.sourceMetadata) || 'N/A'}</span>
          </div>
        </section>

        {/* Delta Context */}
        <section style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Delta Context</div>
          <div style={{ fontSize: 14 }}>
            <span>Delta Amount: {d.formattedDeltaAmount || 'N/A'}</span><br />
            <span>Delta Percent: {d.formattedDeltaPercent || 'N/A'}</span>
          </div>
        </section>
      </div>

      {/* Close Action */}
      <footer style={{ padding: '1rem 1.5rem', borderTop: '1px solid #eee', background: '#fafbfc' }}>
        <button
          onClick={onClose}
          style={{
            background: atlasTheme.colors.eatonBlue,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '0.5rem 1.5rem',
            fontWeight: 600,
            fontSize: 15,
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Close
        </button>
      </footer>
    </aside>
  );
};

// KPI Block subcomponent
function KPIBlock({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div style={{
      background: '#f5faff',
      border: `1px solid ${atlasTheme.colors.eatonBlue}`,
      borderRadius: 8,
      padding: '0.75rem 1rem',
      minWidth: 80,
      textAlign: 'center',
      flex: 1,
    }}>
      <div style={{ fontSize: 13, color: atlasTheme.colors.eatonBlue, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 17, fontWeight: 700, color: '#222', marginTop: 2 }}>{value || '—'}</div>
    </div>
  );
}
