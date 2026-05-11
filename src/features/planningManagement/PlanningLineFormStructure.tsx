import React from "react";
import type {
  FinancialPlanningLineDetailViewModel,
  FteLaborPlanningLineDetailViewModel,
} from "./planningLineDetailModel";

export type PlanningLineFormStructureProps = {
  mode: "financial" | "fteLabor";
  value?: Partial<FinancialPlanningLineDetailViewModel | FteLaborPlanningLineDetailViewModel>;
  onChange?: (value: any) => void;
  readOnly?: boolean;
};

export const PlanningLineFormStructure: React.FC<PlanningLineFormStructureProps> = ({
  mode,
  value = {},
  onChange,
  readOnly,
}) => {
  // Helper for required asterisk
  const Req = () => <span style={{ color: "#c00", marginLeft: 2 }}>*</span>;
  // Helper for input (readOnly = true disables input)
  const input = (name: string, label: string, required = false, type = "text", helper?: string) => (
    <label style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 12 }}>
      <span style={{ fontWeight: 500 }}>
        {label}{required && <Req />}
      </span>
      <input
        type={type}
        name={name}
        value={value[name] ?? ""}
        onChange={onChange ? e => onChange({ ...value, [name]: e.target.value }) : undefined}
        disabled={!!readOnly}
        style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", background: readOnly ? "#f7f7f7" : "#fff" }}
        aria-required={required}
      />
      {helper && <span style={{ color: "#888", fontSize: 12 }}>{helper}</span>}
    </label>
  );
  return (
    <form style={{ background: "#fff", borderRadius: 12, boxShadow: "0 2px 16px #0001", padding: 32, minWidth: 340 }} aria-readonly={readOnly}>
      {mode === "financial" && (
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 600, color: "#003366", marginBottom: 16 }}>Financial Planning Line</legend>
          {input("programLabel", "Program", true)}
          {input("projectLabel", "Project", true)}
          {input("carLabel", "CAR", true)}
          {input("lineType", "Line Type", true)}
          {input("fiscalPeriod", "Fiscal Period", true)}
          {input("budgetStream", "Budget Stream", true)}
          {input("costCategory", "Cost Category", true)}
          {input("plannedAmount", "Planned Amount", true, "number", "USD")} 
          {input("forecastAmount", "Forecast Amount", false, "number", "USD")}
          {input("notes", "Notes", false)}
          {input("status", "Status", false)}
        </fieldset>
      )}
      {mode === "fteLabor" && (
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend style={{ fontWeight: 600, color: "#003366", marginBottom: 16 }}>FTE/Labor Planning Line</legend>
          {input("programLabel", "Program", true)}
          {input("projectLabel", "Project", true)}
          {input("carLabel", "CAR", true)}
          {input("roleOrResource", "Role/Resource", true)}
          {input("namedEmployee", "Named Employee", false)}
          {input("fiscalPeriod", "Fiscal Period", true)}
          {input("fte", "FTE", true, "number", "e.g. 1.00")}
          {input("laborRate", "Labor Rate", true, "number", "USD/hr")}
          {input("calculatedLaborCost", "Calculated Labor Cost", true, "number", "USD (auto)")}
          {input("budgetStream", "Budget Stream", true)}
          {input("costCategory", "Cost Category", true)}
          {input("notes", "Notes", false)}
          {input("status", "Status", false)}
        </fieldset>
      )}
    </form>
  );
};
