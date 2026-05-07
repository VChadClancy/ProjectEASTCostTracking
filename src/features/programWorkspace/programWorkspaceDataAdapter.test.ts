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
});
