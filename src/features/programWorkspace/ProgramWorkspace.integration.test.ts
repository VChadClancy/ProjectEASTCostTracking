import { describe, it, expect } from 'vitest';
import { getProgramWorkspaceRenderModel } from './ProgramWorkspace';

describe('ProgramWorkspace default behavior', () => {
  it('remains default page and does not include forecast comparison sections', () => {
    const model = getProgramWorkspaceRenderModel();
    expect(model.primarySectionTitles).not.toContain('Comparison Overview');
    expect(model.primarySectionTitles).not.toContain('Forecast Comparison');
    expect(model.unsupportedWorkflowLabels).toContain('Create Financial Line');
  });
});
