// src/config/appConfig.test.ts

import { describe, it, expect } from 'vitest';
import { getApiBaseUrl, getFinancialDataSource, buildAppConfig } from './appConfig';

describe('appConfig helpers', () => {
  it('getApiBaseUrl returns default if env is empty', () => {
    expect(getApiBaseUrl({})).toBe('http://localhost:4000/api/v1');
    expect(getApiBaseUrl(undefined)).toBe('http://localhost:4000/api/v1');
  });

  it('getApiBaseUrl returns env value if set', () => {
    expect(getApiBaseUrl({ VITE_API_BASE_URL: 'https://api.example.com/v1' })).toBe('https://api.example.com/v1');
  });

  it('getFinancialDataSource returns default if env is empty', () => {
    expect(getFinancialDataSource({})).toBe('mock');
    expect(getFinancialDataSource(undefined)).toBe('mock');
  });

  it('getFinancialDataSource returns env value if valid', () => {
    expect(getFinancialDataSource({ VITE_FINANCIAL_DATA_SOURCE: 'api' })).toBe('api');
    expect(getFinancialDataSource({ VITE_FINANCIAL_DATA_SOURCE: 'mock' })).toBe('mock');
  });

  it('getFinancialDataSource falls back to mock if env value is invalid', () => {
    expect(getFinancialDataSource({ VITE_FINANCIAL_DATA_SOURCE: 'invalid' })).toBe('mock');
    expect(getFinancialDataSource({ VITE_FINANCIAL_DATA_SOURCE: '' })).toBe('mock');
  });

  it('buildAppConfig returns correct config for env', () => {
    expect(buildAppConfig({})).toEqual({
      apiBaseUrl: 'http://localhost:4000/api/v1',
      financialDataSource: 'mock',
      SUPPORTED_FINANCIAL_DATA_SOURCES: ['mock', 'api'],
    });
    expect(buildAppConfig({ VITE_API_BASE_URL: 'https://api.example.com/v1', VITE_FINANCIAL_DATA_SOURCE: 'api' })).toEqual({
      apiBaseUrl: 'https://api.example.com/v1',
      financialDataSource: 'api',
      SUPPORTED_FINANCIAL_DATA_SOURCES: ['mock', 'api'],
    });
  });
});
