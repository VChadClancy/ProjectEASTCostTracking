import { describe, it, expect } from 'vitest';
import React from 'react';
import { ProgramWorkspace, getProgramWorkspaceRenderModel } from './ProgramWorkspace';
import { getPrimaryProgramWorkspaceSections, getFutureProgramWorkspaceSections } from './programWorkspaceModel';

// 1. Export exists
it('should export ProgramWorkspace component', () => {
  expect(ProgramWorkspace).toBeDefined();
});

// 2. Can be created as a React element
it('can be created as a React element', () => {
  const el = <ProgramWorkspace />;
  expect(el).toBeTruthy();
});

describe('ProgramWorkspace layout', () => {
  it('primary section titles match model', () => {
    const model = getProgramWorkspaceRenderModel();
    const primary = getPrimaryProgramWorkspaceSections();
    expect(model.primarySectionTitles).toEqual(primary.map(s => s.title));
  });

  it('includes Actuals Intake Readiness in future/placeholder sections', () => {
    const model = getProgramWorkspaceRenderModel();
    expect(model.futureSectionTitles).toContain('Actuals Intake Readiness');
  });

  it('does not include unsupported workflow labels', () => {
    const model = getProgramWorkspaceRenderModel();
    const allTitles = [...model.primarySectionTitles, ...model.futureSectionTitles].join(' ');
    model.unsupportedWorkflowLabels.forEach(label => {
      expect(allTitles).not.toMatch(new RegExp(label, 'i'));
    });
  });
});
