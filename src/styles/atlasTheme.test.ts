import { describe, it, expect } from 'vitest';
import { atlasTheme } from './atlasTheme';

describe('atlasTheme tokens', () => {
  it('primary color equals Eaton Blue', () => {
    expect(atlasTheme.colors.primary).toBe('#005EB8');
  });

  it('default background/surface tokens exist', () => {
    expect(atlasTheme.colors.background).toBeTruthy();
    expect(atlasTheme.colors.surface).toBeTruthy();
    expect(atlasTheme.colors.surfaceMuted).toBeTruthy();
  });

  it('status colors exist', () => {
    expect(atlasTheme.colors.success).toBe('#4C9D2B');
    expect(atlasTheme.colors.warning).toBe('#FFD100');
    expect(atlasTheme.colors.danger).toBe('#D22730');
    expect(atlasTheme.colors.info).toBe('#00B2A9');
  });

  it('layout tokens exist', () => {
    expect(atlasTheme.layout.leftRailWidth).toBeTruthy();
    expect(atlasTheme.layout.topBarHeight).toBeTruthy();
    expect(atlasTheme.layout.cardRadius).toBeTruthy();
    expect(atlasTheme.layout.pagePadding).toBeTruthy();
  });

  it('tokens are not empty strings', () => {
    Object.values(atlasTheme.colors).forEach(v => expect(v).not.toBe(''));
    Object.values(atlasTheme.layout).forEach(v => expect(v).not.toBe(''));
    Object.values(atlasTheme.typography).forEach(v => expect(v).not.toBe(''));
  });
});
