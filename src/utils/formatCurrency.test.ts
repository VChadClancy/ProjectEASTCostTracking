import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats thousands as $X.XK', () => {
    expect(formatCurrency(28500)).toBe('$28.5K');
    expect(formatCurrency(30000)).toBe('$30.0K');
  });
  it('formats millions as $X.XM', () => {
    expect(formatCurrency(2500000)).toBe('$2.5M');
  });
  it('formats negatives with a dash', () => {
    expect(formatCurrency(-1500)).toBe('-$1.5K');
  });
  it('formats small numbers as $X', () => {
    expect(formatCurrency(999)).toBe('$999');
  });
  it('returns dash for null/NaN', () => {
    expect(formatCurrency(null as any)).toBe('-');
    expect(formatCurrency(NaN)).toBe('-');
  });
});
