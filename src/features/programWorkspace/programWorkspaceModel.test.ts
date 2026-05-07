import { describe, it, expect } from 'vitest';
import {
  programWorkspaceSections,
  getProgramWorkspaceSections,
  getPrimaryProgramWorkspaceSections,
  getFutureProgramWorkspaceSections,
  ProgramWorkspaceSection,
} from './programWorkspaceModel';

function getSectionIds(sections: ProgramWorkspaceSection[]) {
  return sections.map((s) => s.id);
}

describe('Program Workspace Model', () => {
  it('includes all required sections', () => {
    const ids = getSectionIds(programWorkspaceSections);
    expect(ids).toContain('programFinancialSummary');
    expect(ids).toContain('activeProjectsAndCars');
    expect(ids).toContain('financialLinePreview');
    expect(ids).toContain('budgetStreamFunding');
    expect(ids).toContain('varianceSignals');
    expect(ids).toContain('actualsIntakeReadiness');
  });

  it('primary visible section count is within MED guardrail (3–6)', () => {
    const primary = getPrimaryProgramWorkspaceSections();
    expect(primary.length).toBeGreaterThanOrEqual(3);
    expect(primary.length).toBeLessThanOrEqual(6);
  });

  it('all section ids are unique', () => {
    const ids = getSectionIds(programWorkspaceSections);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('actuals intake readiness is marked as future or placeholder', () => {
    const actuals = programWorkspaceSections.find(
      (s) => s.id === 'actualsIntakeReadiness'
    );
    expect(actuals).toBeDefined();
    expect(['future', 'placeholder']).toContain(actuals!.status);
  });

  it('no section is titled as a dense ERP-style module', () => {
    // No section should have a title containing "ERP" or similar dense terms
    const forbidden = /ERP|Enterprise Resource Planning|General Ledger|Journal|Voucher/i;
    for (const section of programWorkspaceSections) {
      expect(forbidden.test(section.title)).toBe(false);
    }
  });

  it('getProgramWorkspaceSections returns all sections', () => {
    expect(getProgramWorkspaceSections().length).toBe(programWorkspaceSections.length);
  });

  it('getFutureProgramWorkspaceSections returns only future/placeholder sections', () => {
    const future = getFutureProgramWorkspaceSections();
    for (const section of future) {
      expect(['future', 'placeholder']).toContain(section.status);
    }
  });
});
