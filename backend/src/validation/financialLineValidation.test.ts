import { describe, it, expect } from 'vitest';
import {
  validateCreateFinancialLineInput,
  validateUpdateFinancialLineInput,
} from './financialLineValidation';

describe('validateCreateFinancialLineInput', () => {
  it('validates a correct input', () => {
    const input = {
      name: 'Line 1',
      programId: 'prog1',
      forecastAmount: 1000,
      actualAmount: 900,
      fiscalYearId: 'fy2026',
      fiscalPeriodId: 'fp01',
    };
    const result = validateCreateFinancialLineInput(input);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('fails if required fields are missing or invalid', () => {
    const input = {
      name: '',
      programId: '',
      forecastAmount: NaN,
      actualAmount: undefined,
      fiscalYearId: '',
      fiscalPeriodId: '',
    };
    const result = validateCreateFinancialLineInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('name is required and must be a non-empty string');
    expect(result.errors).toContain('programId is required and must be a non-empty string');
    expect(result.errors).toContain('forecastAmount is required and must be a finite number');
    expect(result.errors).toContain('actualAmount is required and must be a finite number');
    expect(result.errors).toContain('fiscalYearId is required and must be a non-empty string');
    expect(result.errors).toContain('fiscalPeriodId is required and must be a non-empty string');
  });

  it('accepts optional id if valid', () => {
    const input = {
      id: 'fl-123',
      name: 'Line 2',
      programId: 'prog2',
      forecastAmount: 500,
      actualAmount: 400,
      fiscalYearId: 'fy2026',
      fiscalPeriodId: 'fp02',
    };
    const result = validateCreateFinancialLineInput(input);
    expect(result.valid).toBe(true);
  });

  it('rejects invalid id', () => {
    const input = {
      id: '',
      name: 'Line 3',
      programId: 'prog3',
      forecastAmount: 100,
      actualAmount: 100,
      fiscalYearId: 'fy2026',
      fiscalPeriodId: 'fp03',
    };
    const result = validateCreateFinancialLineInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('id, if provided, must be a non-empty string');
  });

  it('validates budgetStream and costCategory if provided', () => {
    const input = {
      name: 'Line 4',
      programId: 'prog4',
      forecastAmount: 200,
      actualAmount: 150,
      fiscalYearId: 'fy2026',
      fiscalPeriodId: 'fp04',
      budgetStream: '',
      costCategory: '',
    };
    const result = validateCreateFinancialLineInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('budgetStream, if provided, must be a non-empty string');
    expect(result.errors).toContain('costCategory, if provided, must be a non-empty string');
  });
});

describe('validateUpdateFinancialLineInput', () => {
  it('accepts empty input (no update)', () => {
    const input = {};
    const result = validateUpdateFinancialLineInput(input);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('accepts valid partial update', () => {
    const input = { forecastAmount: 123.45 };
    const result = validateUpdateFinancialLineInput(input);
    expect(result.valid).toBe(true);
  });

  it('rejects invalid forecastAmount', () => {
    const input = { forecastAmount: NaN };
    const result = validateUpdateFinancialLineInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('forecastAmount, if provided, must be a finite number');
  });

  it('rejects invalid id or name', () => {
    const input = { id: '', name: '' };
    const result = validateUpdateFinancialLineInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('id, if provided, must be a non-empty string');
    expect(result.errors).toContain('name, if provided, must be a non-empty string');
  });

  it('validates budgetStream and costCategory if provided', () => {
    const input = { budgetStream: '', costCategory: '' };
    const result = validateUpdateFinancialLineInput(input);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('budgetStream, if provided, must be a non-empty string');
    expect(result.errors).toContain('costCategory, if provided, must be a non-empty string');
  });
});
