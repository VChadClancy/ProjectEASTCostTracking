// src/config/appConfig.ts

/**
 * Frontend application configuration module for environment-based settings.
 * Uses Vite environment variables with safe defaults and guardrails.
 */

const DEFAULT_API_BASE_URL = 'http://localhost:4000/api/v1';
const DEFAULT_FINANCIAL_DATA_SOURCE = 'mock';
const SUPPORTED_FINANCIAL_DATA_SOURCES = ['mock', 'api'] as const;

type FinancialDataSource = typeof SUPPORTED_FINANCIAL_DATA_SOURCES[number];

export function getApiBaseUrl(env?: Record<string, string | undefined>): string {
  const envUrl = env?.VITE_API_BASE_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl;
  }
  return DEFAULT_API_BASE_URL;
}

export function getFinancialDataSource(env?: Record<string, string | undefined>): FinancialDataSource {
  const envSource = env?.VITE_FINANCIAL_DATA_SOURCE;
  if (SUPPORTED_FINANCIAL_DATA_SOURCES.includes(envSource as FinancialDataSource)) {
    return envSource as FinancialDataSource;
  }
  return DEFAULT_FINANCIAL_DATA_SOURCE;
}

export function buildAppConfig(env?: Record<string, string | undefined>) {
  return {
    apiBaseUrl: getApiBaseUrl(env),
    financialDataSource: getFinancialDataSource(env),
    SUPPORTED_FINANCIAL_DATA_SOURCES,
  };
}

export const appConfig = buildAppConfig(import.meta.env);
