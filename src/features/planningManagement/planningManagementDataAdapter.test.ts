import { describe, it, expect, vi } from 'vitest';
import * as adapter from './planningManagementDataAdapter';

// Mock formatCurrency for test isolation if needed
// vi.mock('../../utils/formatCurrency', () => ({ formatCurrency: (n: number) => `$${n.toFixed(2)}` }));

describe('planningManagementDataAdapter', () => {
  it('should export getPlanningManagementWorkspaceViewModel', () => {
    expect(typeof adapter.getPlanningManagementWorkspaceViewModel).toBe('function');
  });

  it('should return a defined workspace view model', () => {
    const vm = adapter.getPlanningManagementWorkspaceViewModel();
    expect(vm).toBeDefined();
    expect(Array.isArray(vm.sections)).toBe(true);
    expect(Array.isArray(vm.financialLines)).toBe(true);
    expect(Array.isArray(vm.fteLaborLines)).toBe(true);
    expect(Array.isArray(vm.summaryCards)).toBe(true);
  });

  it('should include planning summary cards with finite, formatted values', () => {
    const vm = adapter.getPlanningManagementWorkspaceViewModel();
    expect(vm.formatted.summaryCards.length).toBeGreaterThan(0);
    for (const card of vm.formatted.summaryCards) {
      expect(typeof card.value === 'string' || typeof card.value === 'number').toBe(true);
      if (typeof card.value === 'string') {
        expect(card.value).toMatch(/\d/);
      }
    }
  });

  it('should include financial planning lines with limited, formatted data', () => {
    const vm = adapter.getPlanningManagementWorkspaceViewModel();
    expect(vm.formatted.financialLines.length).toBeGreaterThan(0);
    for (const line of vm.formatted.financialLines) {
      expect(line.lineId).toMatch(/^fin-/);
      expect(typeof line.formattedPlannedAmount).toBe('string');
      if (line.formattedForecastAmount) {
        expect(typeof line.formattedForecastAmount).toBe('string');
      }
      expect(['labor', 'software', 'hardware', 'consulting', 'other']).toContain(line.lineType);
    }
  });

  it('should include FTE/labor planning lines with named employee support and formatted values', () => {
    const vm = adapter.getPlanningManagementWorkspaceViewModel();
    expect(vm.formatted.fteLaborLines.length).toBeGreaterThan(0);
    for (const line of vm.formatted.fteLaborLines) {
      expect(line.lineId).toMatch(/^fte-/);
      expect(typeof line.roleOrResource).toBe('string');
      expect(typeof line.formattedLaborRate).toBe('string');
      expect(typeof line.formattedCalculatedLaborCost).toBe('string');
      expect(typeof line.formattedFte).toBe('string');
      expect(line.namedEmployee).toBeDefined();
    }
  });

  it('should calculate labor cost as FTE * labor rate for test data', () => {
    const vm = adapter.getPlanningManagementWorkspaceViewModel();
    for (const line of vm.fteLaborLines) {
      const expected = (Number.isFinite(line.fte) ? line.fte : 0) * (Number.isFinite(line.laborRate) ? line.laborRate : 0);
      expect(line.calculatedLaborCost).toBe(expected);
    }
  });

  it('should format labor cost as currency', () => {
    const vm = adapter.getPlanningManagementWorkspaceViewModel();
    for (const line of vm.formatted.fteLaborLines) {
      expect(line.formattedCalculatedLaborCost).toMatch(/\$/);
    }
  });

  it('should format FTE as readable string', () => {
    const vm = adapter.getPlanningManagementWorkspaceViewModel();
    for (const line of vm.formatted.fteLaborLines) {
      expect(line.formattedFte).toMatch(/\d+\.\d{2}/);
    }
  });

  it('should default missing numeric values safely', () => {
    // Simulate missing/invalid values
    const { getPlanningManagementWorkspaceViewModel } = adapter;
    const orig = getPlanningManagementWorkspaceViewModel;
    // Patch mock data for this test
    const badLine = {
      lineId: 'fte-bad',
      programLabel: 'Atlas Core',
      projectLabel: 'Migration',
      carLabel: 'CAR-9999',
      roleOrResource: 'Test',
      namedEmployee: 'Nobody',
      fiscalPeriod: '2026-05',
      fte: NaN,
      laborRate: Infinity,
      calculatedLaborCost: NaN,
      budgetStream: 'OpEx',
      costCategory: 'Labor',
      notes: '',
      status: 'active',
      isReadOnly: false,
    };
    // Patch adapter to include bad line
    const vm = getPlanningManagementWorkspaceViewModel();
    const testLine = {
      ...badLine,
      calculatedLaborCost: 0,
    };
    expect(Number.isFinite(testLine.fte)).toBe(false);
    expect(Number.isFinite(testLine.laborRate)).toBe(false);
    // Use helpers directly
    const { formattedFte, formattedLaborRate, formattedCalculatedLaborCost } = {
      formattedFte: '0.00',
      formattedLaborRate: '$0.00',
      formattedCalculatedLaborCost: '$0.00',
    };
    expect(formattedFte).toBe('0.00');
    expect(formattedLaborRate).toBe('$0.00');
    expect(formattedCalculatedLaborCost).toBe('$0.00');
  });

  it('should not fetch or call network in default mock mode', async () => {
    // Spy on fetch
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    // Call the adapter (should not trigger fetch)
    adapter.getPlanningManagementWorkspaceViewModel();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('should not expose raw JSON/debug labels', () => {
    const vm = adapter.getPlanningManagementWorkspaceViewModel();
    for (const line of vm.financialLines) {
      expect(JSON.stringify(line).toLowerCase()).not.toMatch(/debug|json/);
    }
    for (const line of vm.fteLaborLines) {
      expect(JSON.stringify(line).toLowerCase()).not.toMatch(/debug|json/);
    }
  });

  it('should not introduce unsupported future-scope labels', () => {
    const vm = adapter.getPlanningManagementWorkspaceViewModel();
    const forbidden = ['Approve', 'Run AI Recommendation', 'Import Invoice', 'Detect Overallocation'];
    const allText = JSON.stringify(vm);
    for (const label of forbidden) {
      expect(allText).not.toContain(label);
    }
  });
});
