import { describe, it, expect, vi } from "vitest";
import * as adapter from "./programWorkspaceDataAdapter";

describe("programWorkspaceDataAdapter", () => {
  it("should export getProgramWorkspaceSummary", () => {
    expect(typeof adapter.getProgramWorkspaceSummary).toBe("function");
  });

  it("should return a defined view model using mock/default data", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: {} });
    expect(result).toBeDefined();
    expect(typeof result.programName).toBe("string");
  });

  it("should return finite numeric totals and variance values", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { totalBudget: 100, totalForecast: 80, totalActuals: 70, varianceAmount: 20, variancePercent: 20, activeProjectCount: 1, activeCarCount: 2, financialLineCount: 3, programName: "Test" } });
    expect(Number.isFinite(result.totalBudget)).toBe(true);
    expect(Number.isFinite(result.totalForecast)).toBe(true);
    expect(Number.isFinite(result.totalActuals)).toBe(true);
    expect(Number.isFinite(result.varianceAmount)).toBe(true);
    expect(Number.isFinite(result.variancePercent)).toBe(true);
  });

  it("should handle empty data safely", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: null });
    expect(result).toBeDefined();
    expect(result.programName).toBe("");
    expect(result.totalBudget).toBe(0);
    expect(result.totalForecast).toBe(0);
    expect(result.totalActuals).toBe(0);
    expect(result.varianceAmount).toBe(0);
    expect(result.variancePercent).toBe(0);
    expect(result.activeProjectCount).toBe(0);
    expect(result.activeCarCount).toBe(0);
    expect(result.financialLineCount).toBe(0);
  });

  it("should return a limited financialLinePreview list (max 5)", async () => {
    const mockLines = Array.from({ length: 10 }).map((_, i) => ({
      id: `FL${i+1}`,
      programId: 'P1',
      projectId: `PRJ${i+1}`,
      budgetStream: 'Run',
      costCategoryKey: 'cat',
      forecastAmount: 1000 + i,
      actualAmount: 900 + i,
      varianceAmount: 100 + i,
    }));
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { programName: 'Test', totalBudget: 1, totalForecast: 1, totalActuals: 1, varianceAmount: 1, variancePercent: 1, activeProjectCount: 1, activeCarCount: 1, financialLineCount: 10 }, financialLinesData: mockLines });
    expect(Array.isArray(result.financialLinePreview)).toBe(true);
    if (result.financialLinePreview) {
      expect(result.financialLinePreview.length).toBeLessThanOrEqual(5);
      for (const line of result.financialLinePreview) {
        expect(line).toHaveProperty('id');
        expect(line).toHaveProperty('label');
      }
    }
  });

  it("should handle empty financial lines safely", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { programName: 'Test', totalBudget: 1, totalForecast: 1, totalActuals: 1, varianceAmount: 1, variancePercent: 1, activeProjectCount: 1, activeCarCount: 1, financialLineCount: 0 }, financialLinesData: [] });
    expect(Array.isArray(result.financialLinePreview)).toBe(true);
    if (result.financialLinePreview) {
      expect(result.financialLinePreview.length).toBe(0);
    }
  });

  it("should not trigger fetch/network calls in default mock mode", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await adapter.getProgramWorkspaceSummary({ summaryData: {}, financialLinesData: [] });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("should return a limited projectsAndCarsOverview list (max 5)", async () => {
    const mockLines = Array.from({ length: 10 }).map((_, i) => ({
      id: `FL${i+1}`,
      programId: 'P1',
      projectId: `PRJ${Math.floor(i/2)+1}`,
      carId: i % 2 === 0 ? `CAR${i+1}` : undefined,
      forecastAmount: 1000 + i,
      actualAmount: 900 + i,
      varianceAmount: 100 + i,
    }));
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { programName: 'Test', totalBudget: 1, totalForecast: 1, totalActuals: 1, varianceAmount: 1, variancePercent: 1, activeProjectCount: 1, activeCarCount: 1, financialLineCount: 10 }, financialLinesData: mockLines });
    expect(Array.isArray(result.projectsAndCarsOverview)).toBe(true);
    if (result.projectsAndCarsOverview) {
      expect(result.projectsAndCarsOverview.length).toBeLessThanOrEqual(5);
      for (const item of result.projectsAndCarsOverview) {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('projectId');
        expect(item).toHaveProperty('carId');
      }
    }
  });

  it("should handle empty projectsAndCarsOverview safely", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { programName: 'Test', totalBudget: 1, totalForecast: 1, totalActuals: 1, varianceAmount: 1, variancePercent: 1, activeProjectCount: 1, activeCarCount: 1, financialLineCount: 0 }, financialLinesData: [] });
    expect(Array.isArray(result.projectsAndCarsOverview)).toBe(true);
    if (result.projectsAndCarsOverview) {
      expect(result.projectsAndCarsOverview.length).toBe(0);
    }
  });

  it("should not introduce unsupported workflow labels in projectsAndCarsOverview", async () => {
    const mockLines = [
      { id: 'FL1', programId: 'P1', projectId: 'PRJ1', carId: 'CAR1', forecastAmount: 100, actualAmount: 90, varianceAmount: 10 }
    ];
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { programName: 'Test', totalBudget: 1, totalForecast: 1, totalActuals: 1, varianceAmount: 1, variancePercent: 1, activeProjectCount: 1, activeCarCount: 1, financialLineCount: 1 }, financialLinesData: mockLines });
    const forbidden = ["Create Project", "Edit Project", "Delete Project", "Detailed Schedule", "Gantt"];
    if (result.projectsAndCarsOverview) {
      for (const item of result.projectsAndCarsOverview) {
        for (const label of forbidden) {
          expect(JSON.stringify(item)).not.toContain(label);
        }
      }
    }
  });

  it("should include projectsAndCarsOverview in the render model metadata", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: {}, financialLinesData: [] });
    expect(result).toHaveProperty('projectsAndCarsOverview');
  });

  it("should return a limited budgetStreamFunding list (max 5)", async () => {
    const mockLines = Array.from({ length: 10 }).map((_, i) => ({
      id: `FL${i+1}`,
      programId: 'P1',
      projectId: `PRJ${i+1}`,
      budgetStream: `Stream${i % 6}`,
      forecastAmount: 1000 + i,
      actualAmount: 900 + i,
      varianceAmount: 100 + i,
      // Simulate budget field
      budget: 1100 + i,
    }));
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { programName: 'Test', totalBudget: 1, totalForecast: 1, totalActuals: 1, varianceAmount: 1, variancePercent: 1, activeProjectCount: 1, activeCarCount: 1, financialLineCount: 10 }, financialLinesData: mockLines });
    expect(Array.isArray(result.budgetStreamFunding)).toBe(true);
    if (result.budgetStreamFunding) {
      expect(result.budgetStreamFunding.length).toBeLessThanOrEqual(5);
      for (const item of result.budgetStreamFunding) {
        expect(item).toHaveProperty('budgetStream');
        expect(item).toHaveProperty('totalBudget');
        expect(item).toHaveProperty('totalForecast');
        expect(item).toHaveProperty('totalActuals');
        expect(item).toHaveProperty('variance');
        expect(item).toHaveProperty('financialLineCount');
      }
    }
  });

  it("should handle empty budgetStreamFunding safely", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { programName: 'Test', totalBudget: 1, totalForecast: 1, totalActuals: 1, varianceAmount: 1, variancePercent: 1, activeProjectCount: 1, activeCarCount: 1, financialLineCount: 0 }, financialLinesData: [] });
    expect(Array.isArray(result.budgetStreamFunding)).toBe(true);
    if (result.budgetStreamFunding) {
      expect(result.budgetStreamFunding.length).toBe(0);
    }
  });

  it("should return finite rollup values in budgetStreamFunding", async () => {
    const mockLines = [
      { id: 'FL1', programId: 'P1', budgetStream: 'A', forecastAmount: 100, actualAmount: 90, varianceAmount: 10, budget: 110 },
      { id: 'FL2', programId: 'P1', budgetStream: 'A', forecastAmount: 200, actualAmount: 180, varianceAmount: 20, budget: 220 },
      { id: 'FL3', programId: 'P1', budgetStream: 'B', forecastAmount: 300, actualAmount: 270, varianceAmount: 30, budget: 330 },
    ];
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { programName: 'Test', totalBudget: 1, totalForecast: 1, totalActuals: 1, varianceAmount: 1, variancePercent: 1, activeProjectCount: 1, activeCarCount: 1, financialLineCount: 3 }, financialLinesData: mockLines });
    if (result.budgetStreamFunding) {
      for (const item of result.budgetStreamFunding) {
        expect(Number.isFinite(item.totalBudget)).toBe(true);
        expect(Number.isFinite(item.totalForecast)).toBe(true);
        expect(Number.isFinite(item.totalActuals)).toBe(true);
        expect(Number.isFinite(item.variance)).toBe(true);
        expect(Number.isFinite(item.financialLineCount)).toBe(true);
      }
    }
  });

  it("should include budgetStreamFunding in the render model metadata", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: {}, financialLinesData: [] });
    expect(result).toHaveProperty('budgetStreamFunding');
  });

  it("should not introduce unsupported workflow/accounting/procurement labels in budgetStreamFunding", async () => {
    const mockLines = [
      { id: 'FL1', programId: 'P1', budgetStream: 'A', forecastAmount: 100, actualAmount: 90, varianceAmount: 10, budget: 110 },
      { id: 'FL2', programId: 'P1', budgetStream: 'B', forecastAmount: 200, actualAmount: 180, varianceAmount: 20, budget: 220 },
    ];
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: { programName: 'Test', totalBudget: 1, totalForecast: 1, totalActuals: 1, varianceAmount: 1, variancePercent: 1, activeProjectCount: 1, activeCarCount: 1, financialLineCount: 2 }, financialLinesData: mockLines });
    const forbidden = [
      "Create PO", "Invoice Processing", "Accounting Ledger", "Procurement Workflow",
      "Create Project", "Edit Project", "Delete Project", "Detailed Schedule", "Gantt"
    ];
    if (result.budgetStreamFunding) {
      for (const item of result.budgetStreamFunding) {
        for (const label of forbidden) {
          expect(JSON.stringify(item)).not.toContain(label);
        }
      }
    }
  });

  it("should not trigger fetch/network calls for budgetStreamFunding in default mock mode", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await adapter.getProgramWorkspaceSummary({ summaryData: {}, financialLinesData: [] });
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it("should return a limited varianceSignals list (max 5) with safe fields and allowed severities", async () => {
    const mockSummary = {
      programName: 'Test',
      totalBudget: 1000,
      totalForecast: 800,
      totalActuals: 700,
      varianceAmount: 200,
      variancePercent: 20,
      activeProjectCount: 2,
      activeCarCount: 1,
      financialLineCount: 3,
    };
    const mockLines = [
      { id: 'FL1', programId: 'P1', projectId: 'PRJ1', budgetStream: 'A', forecastAmount: 100, actualAmount: 90, varianceAmount: 10, budget: 110 },
      { id: 'FL2', programId: 'P1', projectId: 'PRJ2', budgetStream: 'B', forecastAmount: 200, actualAmount: 180, varianceAmount: 20, budget: 220 },
      { id: 'FL3', programId: 'P1', carId: 'CAR1', budgetStream: 'A', forecastAmount: 300, actualAmount: 270, varianceAmount: 30, budget: 330 },
      { id: 'FL4', programId: 'P1', carId: 'CAR2', budgetStream: 'B', forecastAmount: 400, actualAmount: 380, varianceAmount: 20, budget: 420 },
      { id: 'FL5', programId: 'P1', projectId: 'PRJ3', budgetStream: 'C', forecastAmount: 500, actualAmount: 480, varianceAmount: 20, budget: 520 },
    ];
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: mockSummary, financialLinesData: mockLines });
    expect(Array.isArray(result.varianceSignals)).toBe(true);
    if (result.varianceSignals) {
      expect(result.varianceSignals.length).toBeLessThanOrEqual(5);
      for (const signal of result.varianceSignals) {
        expect(signal).toHaveProperty('id');
        expect(signal).toHaveProperty('label');
        expect(signal).toHaveProperty('description');
        expect(signal).toHaveProperty('varianceAmount');
        expect(['healthy', 'attention', 'risk', 'info']).toContain(signal.severity);
        expect(['program', 'project', 'CAR', 'budgetStream', 'financialLine']).toContain(signal.relatedArea);
      }
    }
  });

  it("should handle empty/zero variance data safely in varianceSignals", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: {}, financialLinesData: [] });
    expect(Array.isArray(result.varianceSignals)).toBe(true);
    if (result.varianceSignals) {
      expect(result.varianceSignals.length).toBe(0);
    }
  });

  it("should not introduce unsupported labels or workflow actions in varianceSignals", async () => {
    const mockSummary = {
      programName: 'Test',
      totalBudget: 1000,
      totalForecast: 800,
      totalActuals: 700,
      varianceAmount: 200,
      variancePercent: 20,
      activeProjectCount: 2,
      activeCarCount: 1,
      financialLineCount: 3,
    };
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: mockSummary, financialLinesData: [] });
    const forbidden = [
      "AI Variance Explanation", "Auto Correct", "Approve Variance", "Create Project", "Edit Project", "Delete Project"
    ];
    if (result.varianceSignals) {
      for (const signal of result.varianceSignals) {
        for (const label of forbidden) {
          expect(JSON.stringify(signal)).not.toContain(label);
        }
      }
    }
  });

  it("should always include actualsIntakeReadiness marker with all items marked as future/placeholder", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: {}, financialLinesData: [] });
    expect(Array.isArray(result.actualsIntakeReadiness)).toBe(true);
    expect(result.actualsIntakeReadiness!.length).toBeGreaterThanOrEqual(5);
    for (const item of result.actualsIntakeReadiness!) {
      expect(['future', 'placeholder']).toContain(item.status);
      // Only block action/workflow labels, not capability nouns
      expect(item.label).not.toMatch(/Upload Invoice|Post Actuals|Approve Invoice|Run OCR|Start Intake|Process Invoice|Execute Automation/i);
    }
  });

  it("should not introduce unsupported workflow labels in actualsIntakeReadiness", async () => {
    const result = await adapter.getProgramWorkspaceSummary({ summaryData: {}, financialLinesData: [] });
    const forbidden = [
      "Upload Invoice", "Post Actuals", "Approve Invoice", "Run OCR", "Start Intake", "Process Invoice", "Execute Automation"
    ];
    for (const item of result.actualsIntakeReadiness!) {
      for (const label of forbidden) {
        expect(item.label).not.toContain(label);
        expect(item.description).not.toContain(label);
      }
    }
  });
});
