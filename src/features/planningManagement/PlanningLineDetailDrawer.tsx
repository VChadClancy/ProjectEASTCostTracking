import React from "react";
import type {
  FinancialPlanningLineDetailViewModel,
  FteLaborPlanningLineDetailViewModel,
} from "./planningLineDetailModel";

export type PlanningLineDetailDrawerProps = {
  open: boolean;
  onClose: () => void;
  financialDetail?: FinancialPlanningLineDetailViewModel | null;
  fteLaborDetail?: FteLaborPlanningLineDetailViewModel | null;
};

function formatCurrency(amount?: number) {
  if (typeof amount !== "number") return "-";
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}
function formatFTE(fte?: number) {
  if (typeof fte !== "number") return "-";
  return fte.toFixed(2);
}
function formatRate(rate?: number) {
  if (typeof rate !== "number") return "-";
  return rate.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });
}

export const PlanningLineDetailDrawer: React.FC<PlanningLineDetailDrawerProps> = ({
  open,
  onClose,
  financialDetail,
  fteLaborDetail,
}) => {
  if (!open) return null;
  const isFinancial = !!financialDetail;
  const isFteLabor = !!fteLaborDetail;
  if (!isFinancial && !isFteLabor) {
    return (
      <aside style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: 32, minWidth: 340 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 600, fontSize: 18 }}>Planning Line Detail</span>
          <button aria-label="Close" onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>&times;</button>
        </header>
        <div style={{ color: "#888", marginTop: 24 }}>No planning line selected.</div>
      </aside>
    );
  }
  return (
    <aside style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: 32, minWidth: 340 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 600, fontSize: 18, color: "#003366" }}>
          {isFinancial ? "Financial Planning Line" : "FTE/Labor Planning Line"}
        </span>
        <button aria-label="Close" onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>&times;</button>
      </header>
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
        {isFinancial && financialDetail && (
          <>
            <div><strong>Program:</strong> {financialDetail.programLabel}</div>
            <div><strong>Project:</strong> {financialDetail.projectLabel}</div>
            <div><strong>CAR:</strong> {financialDetail.carLabel}</div>
            <div><strong>Line Type:</strong> {financialDetail.lineType}</div>
            <div><strong>Fiscal Period:</strong> {financialDetail.fiscalPeriod}</div>
            <div><strong>Budget Stream:</strong> {financialDetail.budgetStream}</div>
            <div><strong>Cost Category:</strong> {financialDetail.costCategory}</div>
            <div><strong>Planned Amount:</strong> {formatCurrency(financialDetail.plannedAmount)}</div>
            <div><strong>Forecast Amount:</strong> {formatCurrency(financialDetail.forecastAmount)}</div>
            {financialDetail.notes && <div><strong>Notes:</strong> {financialDetail.notes}</div>}
            {financialDetail.status && <div><strong>Status:</strong> {financialDetail.status}</div>}
          </>
        )}
        {isFteLabor && fteLaborDetail && (
          <>
            <div><strong>Program:</strong> {fteLaborDetail.programLabel}</div>
            <div><strong>Project:</strong> {fteLaborDetail.projectLabel}</div>
            <div><strong>CAR:</strong> {fteLaborDetail.carLabel}</div>
            <div><strong>Role/Resource:</strong> {fteLaborDetail.roleOrResource}</div>
            {fteLaborDetail.namedEmployee && <div><strong>Named Employee:</strong> {fteLaborDetail.namedEmployee}</div>}
            <div><strong>Fiscal Period:</strong> {fteLaborDetail.fiscalPeriod}</div>
            <div><strong>FTE:</strong> {formatFTE(fteLaborDetail.fte)}</div>
            <div><strong>Labor Rate:</strong> {formatRate(fteLaborDetail.laborRate)}</div>
            <div><strong>Calculated Labor Cost:</strong> {formatCurrency(fteLaborDetail.calculatedLaborCost)}</div>
            <div><strong>Budget Stream:</strong> {fteLaborDetail.budgetStream}</div>
            <div><strong>Cost Category:</strong> {fteLaborDetail.costCategory}</div>
            {fteLaborDetail.notes && <div><strong>Notes:</strong> {fteLaborDetail.notes}</div>}
            {fteLaborDetail.status && <div><strong>Status:</strong> {fteLaborDetail.status}</div>}
          </>
        )}
      </div>
    </aside>
  );
};
