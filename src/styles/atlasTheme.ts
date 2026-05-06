// Atlas MED Design Tokens (Eaton-aligned)
// src/styles/atlasTheme.ts

export const atlasTheme = {
  // Brand Colors
  colors: {
    eatonBlue: '#005EB8',
    eatonDarkBlue: '#004B85',
    charcoal: '#333F48',
    mediumGray: '#98A4AE',
    white: '#FFFFFF',
    black: '#000000',
    green: '#4C9D2B',
    yellow: '#FFD100',
    red: '#D22730',
    teal: '#00B2A9',
    // Semantic
    primary: '#005EB8', // Eaton Blue
    primaryHover: '#004B85', // Eaton Dark Blue
    background: '#FFFFFF',
    surface: '#F4EFE7',
    surfaceMuted: '#F1E2BF',
    textPrimary: '#333F48', // Charcoal
    textSecondary: '#98A4AE', // Medium Gray
    border: '#98A4AE',
    success: '#4C9D2B',
    warning: '#FFD100',
    danger: '#D22730',
    info: '#00B2A9',
    aiInsight: '#005EB8', // Use Eaton Blue for AI highlights
  },
  // Layout Tokens
  layout: {
    leftRailWidth: '240px',
    leftRailCollapsedWidth: '64px',
    topBarHeight: '56px',
    workspaceMaxWidth: '1440px',
    cardRadius: '12px',
    cardShadow: '0 4px 24px rgba(51, 63, 72, 0.08)',
    pagePadding: '32px',
    sectionGap: '24px',
  },
  // Typography Scale
  typography: {
    display: '2.5rem', // 40px
    title: '2rem', // 32px
    sectionTitle: '1.25rem', // 20px
    body: '1rem', // 16px
    caption: '0.875rem', // 14px
  },
};
